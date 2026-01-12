/**
 * AuroraFlow - Smart Insights Engine
 *
 * Rule-based pattern detection that analyzes glucose logs
 * and generates personalized, actionable insights.
 *
 * Author: Caitlin Przywara
 * Created: January 2025
 */

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

class InsightsEngine {

  /**
   * Main function - Generates all insights for a user
   * @param {string} userId - The user's ID
   * @param {number} daysBack - How many days of history to analyze (default: 14)
   * @returns {Array} - Array of insight objects
   */
  async generateInsights(userId, daysBack = 14) {
    try {
      // Fetch user's recent glucose logs
      const logs = await this.fetchGlucoseLogs(userId, daysBack);

      if (logs.length < 3) {
        return [{
          type: 'info',
          priority: 'low',
          title: 'Keep Logging',
          message: 'Log a few more readings to unlock personalized insights!',
          icon: '📊'
        }];
      }

      const insights = [];

      // Run all analysis rules
      insights.push(...this.detectPostMealSpikes(logs));
      insights.push(...this.detectMorningPatterns(logs));
      insights.push(...this.detectProgressTrends(logs));
      insights.push(...this.detectTimeOfDayPatterns(logs));
      insights.push(...this.detectLoggingGaps(logs));

      // Sort by priority (high → medium → low)
      return this.prioritizeInsights(insights);

    } catch (error) {
      console.error('InsightsEngine error:', error);
      return [];
    }
  }

  /**
   * Fetch glucose logs from backend API
   */
  async fetchGlucoseLogs(userId, daysBack) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysBack);

      const response = await fetch(`${API_URL}/api/glucose`);

      if (!response.ok) {
        throw new Error('Failed to fetch glucose logs');
      }

      const data = await response.json();
      const logs = Array.isArray(data) ? data : data.readings || [];

      // Filter by date and transform to expected format
      return logs
        .filter(log => {
          const logDate = new Date(log.reading_time || log.timestamp || log.created_at);
          return logDate >= cutoffDate;
        })
        .map(log => ({
          glucose_value: log.glucose_level || log.value || log.glucose_value,
          created_at: log.reading_time || log.timestamp || log.created_at,
          meal_context: log.meal_type || log.meal_context || log.notes,
          notes: log.notes
        }));

    } catch (error) {
      console.error('Error fetching glucose logs:', error);
      return [];
    }
  }

  /**
   * RULE 1: Post-Meal Spike Detection
   * Identifies meals that consistently cause elevated glucose
   */
  detectPostMealSpikes(logs) {
    const insights = [];
    const postMealLogs = logs.filter(log =>
      log.meal_context && log.glucose_value > 180
    );

    if (postMealLogs.length >= 3) {
      // Group by meal type
      const mealTypes = {};
      postMealLogs.forEach(log => {
        const meal = log.meal_context || 'meal';
        mealTypes[meal] = (mealTypes[meal] || 0) + 1;
      });

      // Find most problematic meal
      const topMeal = Object.entries(mealTypes)
        .sort((a, b) => b[1] - a[1])[0];

      if (topMeal && topMeal[1] >= 3) {
        insights.push({
          type: 'alert',
          priority: 'high',
          title: `${this.capitalize(topMeal[0])} Pattern Detected`,
          message: `Your glucose has been elevated after ${topMeal[0]} ${topMeal[1]} times recently. Consider smaller portions, adding protein, or a 10-minute walk after eating.`,
          icon: '🍽️',
          actionable: true,
          data: { meal: topMeal[0], occurrences: topMeal[1] }
        });
      }
    }

    return insights;
  }

  /**
   * RULE 2: Morning Pattern Detection
   * Identifies elevated fasting glucose (dawn phenomenon)
   */
  detectMorningPatterns(logs) {
    const insights = [];
    const morningLogs = logs.filter(log => {
      const hour = new Date(log.created_at).getHours();
      return hour >= 5 && hour <= 9 && !log.meal_context; // Fasting readings
    });

    const highMornings = morningLogs.filter(log => log.glucose_value > 130);

    if (highMornings.length >= 4 && morningLogs.length >= 5) {
      const avgMorning = this.calculateAverage(highMornings.map(l => l.glucose_value));

      insights.push({
        type: 'alert',
        priority: 'high',
        title: 'Elevated Morning Readings',
        message: `Your fasting glucose has been above 130 mg/dL on ${highMornings.length} of the last ${morningLogs.length} mornings (avg: ${Math.round(avgMorning)} mg/dL). This could be dawn phenomenon. Consider discussing with your care team.`,
        icon: '🌅',
        actionable: true,
        data: { avgMorning, highDays: highMornings.length }
      });
    }

    return insights;
  }

  /**
   * RULE 3: Progress Trend Detection
   * Celebrates improvements and warns about negative trends
   */
  detectProgressTrends(logs) {
    const insights = [];

    if (logs.length < 14) return insights; // Need 2 weeks minimum

    // Split into recent vs. previous week
    const midpoint = Math.floor(logs.length / 2);
    const recentWeek = logs.slice(0, midpoint);
    const previousWeek = logs.slice(midpoint);

    const recentAvg = this.calculateAverage(recentWeek.map(l => l.glucose_value));
    const previousAvg = this.calculateAverage(previousWeek.map(l => l.glucose_value));

    const change = recentAvg - previousAvg;
    const percentChange = ((change / previousAvg) * 100).toFixed(1);

    // Improvement detected
    if (change < -10) {
      insights.push({
        type: 'success',
        priority: 'medium',
        title: 'Excellent Progress! 🎉',
        message: `Your average glucose dropped from ${Math.round(previousAvg)} to ${Math.round(recentAvg)} mg/dL this week (${Math.abs(percentChange)}% improvement). Keep up the great work!`,
        icon: '📈',
        actionable: false,
        data: { previousAvg, recentAvg, change }
      });
    }

    // Negative trend
    if (change > 15) {
      insights.push({
        type: 'alert',
        priority: 'medium',
        title: 'Rising Average Detected',
        message: `Your average glucose increased from ${Math.round(previousAvg)} to ${Math.round(recentAvg)} mg/dL this week. Review your recent meals and activity levels.`,
        icon: '📊',
        actionable: true,
        data: { previousAvg, recentAvg, change }
      });
    }

    return insights;
  }

  /**
   * RULE 4: Time-of-Day Pattern Detection
   * Identifies specific times when glucose is consistently high/low
   */
  detectTimeOfDayPatterns(logs) {
    const insights = [];
    const timeGroups = {
      morning: [], // 6am-11am
      afternoon: [], // 12pm-5pm
      evening: [] // 6pm-11pm
    };

    logs.forEach(log => {
      const hour = new Date(log.created_at).getHours();
      if (hour >= 6 && hour < 12) timeGroups.morning.push(log.glucose_value);
      else if (hour >= 12 && hour < 18) timeGroups.afternoon.push(log.glucose_value);
      else if (hour >= 18 && hour < 24) timeGroups.evening.push(log.glucose_value);
    });

    // Find time period with highest average
    let highestPeriod = null;
    let highestAvg = 0;

    Object.entries(timeGroups).forEach(([period, values]) => {
      if (values.length >= 3) {
        const avg = this.calculateAverage(values);
        if (avg > highestAvg && avg > 160) {
          highestAvg = avg;
          highestPeriod = period;
        }
      }
    });

    if (highestPeriod) {
      insights.push({
        type: 'info',
        priority: 'medium',
        title: `${this.capitalize(highestPeriod)} Trend`,
        message: `Your glucose tends to be higher in the ${highestPeriod} (avg: ${Math.round(highestAvg)} mg/dL). Consider adjusting meal timing or adding activity during this window.`,
        icon: '⏰',
        actionable: true,
        data: { period: highestPeriod, average: highestAvg }
      });
    }

    return insights;
  }

  /**
   * RULE 5: Logging Gap Detection
   * Gentle reminder when user hasn't logged recently
   */
  detectLoggingGaps(logs) {
    const insights = [];

    if (logs.length === 0) return insights;

    const lastLog = new Date(logs[0].created_at);
    const hoursSinceLastLog = (Date.now() - lastLog) / (1000 * 60 * 60);

    if (hoursSinceLastLog > 24) {
      insights.push({
        type: 'info',
        priority: 'low',
        title: 'Missing Recent Logs',
        message: `It's been ${Math.round(hoursSinceLastLog)} hours since your last entry. Regular logging helps us spot patterns early!`,
        icon: '📝',
        actionable: true,
        data: { hoursSince: hoursSinceLastLog }
      });
    }

    return insights;
  }

  /**
   * Helper: Calculate average
   */
  calculateAverage(values) {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Helper: Capitalize first letter
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Helper: Sort insights by priority
   */
  prioritizeInsights(insights) {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return insights.sort((a, b) =>
      priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }
}

// Export singleton instance
export default new InsightsEngine();
