// In-memory data store for demo purposes
// This simulates a database without requiring PostgreSQL or Supabase

class MemoryStore {
  constructor() {
    this.readings = [];
    this.meals = [];
    this.exercises = [];
    this.users = new Map();
    this.readingIdCounter = 1;
    this.mealIdCounter = 1;
    this.exerciseIdCounter = 1;

    // Add some mock data for demo
    this.addMockData();
  }

  addMockData() {
    const guestId = 'guest-demo';
    const now = new Date();

    // Add readings for the past few days
    const mockReadings = [
      { value: 142, timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), notes: 'After lunch' }, // 2 hours ago
      { value: 118, timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000), notes: 'Before lunch' }, // 4 hours ago
      { value: 95, timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000), notes: 'Fasting' }, // 8 hours ago
      { value: 156, timestamp: new Date(now.getTime() - 20 * 60 * 60 * 1000), notes: 'After dinner' }, // yesterday evening
      { value: 102, timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), notes: 'Morning reading' }, // yesterday morning
      { value: 88, timestamp: new Date(now.getTime() - 28 * 60 * 60 * 1000), notes: 'Before breakfast' }, // yesterday morning
    ];

    mockReadings.forEach((reading) => {
      this.readings.push({
        id: this.readingIdCounter++,
        user_id: guestId,
        glucose_level: reading.value,
        reading_time: reading.timestamp.toISOString(),
        notes: reading.notes,
        created_at: reading.timestamp.toISOString(),
      });
    });
  }

  // Create a new glucose reading
  async createReading(userId, value, timestamp, notes) {
    const reading = {
      id: this.readingIdCounter++,
      user_id: userId,
      glucose_level: parseFloat(value),
      reading_time: timestamp,
      notes: notes || null,
      created_at: new Date().toISOString(),
    };

    this.readings.push(reading);
    return reading;
  }

  // Get all readings for a user
  async getReadings(userId) {
    // For guest users, return all guest readings
    const userReadings = this.readings.filter((r) => {
      if (userId.startsWith('guest-')) {
        return r.user_id.startsWith('guest-');
      }
      return r.user_id === userId;
    });

    // Sort by reading time, newest first
    return userReadings.sort((a, b) =>
      new Date(b.reading_time) - new Date(a.reading_time)
    );
  }

  // Delete a reading
  async deleteReading(userId, readingId) {
    const index = this.readings.findIndex((r) => {
      if (userId.startsWith('guest-')) {
        return r.id === parseInt(readingId) && r.user_id.startsWith('guest-');
      }
      return r.id === parseInt(readingId) && r.user_id === userId;
    });

    if (index === -1) {
      return null;
    }

    const deleted = this.readings.splice(index, 1)[0];
    return deleted;
  }

  // MEAL METHODS
  async createMeal(userId, foodName, carbs, timestamp, notes) {
    const meal = {
      id: this.mealIdCounter++,
      user_id: userId,
      food_name: foodName,
      carbs: parseFloat(carbs),
      meal_time: timestamp,
      notes: notes || null,
      created_at: new Date().toISOString(),
    };

    this.meals.push(meal);
    return meal;
  }

  async getMeals(userId) {
    const userMeals = this.meals.filter((m) => {
      if (userId.startsWith('guest-')) {
        return m.user_id.startsWith('guest-');
      }
      return m.user_id === userId;
    });

    return userMeals.sort((a, b) =>
      new Date(b.meal_time) - new Date(a.meal_time)
    );
  }

  async deleteMeal(userId, mealId) {
    const index = this.meals.findIndex((m) => {
      if (userId.startsWith('guest-')) {
        return m.id === parseInt(mealId) && m.user_id.startsWith('guest-');
      }
      return m.id === parseInt(mealId) && m.user_id === userId;
    });

    if (index === -1) {
      return null;
    }

    const deleted = this.meals.splice(index, 1)[0];
    return deleted;
  }

  // EXERCISE METHODS
  async createExercise(userId, activityType, duration, timestamp, notes) {
    const exercise = {
      id: this.exerciseIdCounter++,
      user_id: userId,
      activity_type: activityType,
      duration: parseInt(duration),
      exercise_time: timestamp,
      notes: notes || null,
      created_at: new Date().toISOString(),
    };

    this.exercises.push(exercise);
    return exercise;
  }

  async getExercises(userId) {
    const userExercises = this.exercises.filter((e) => {
      if (userId.startsWith('guest-')) {
        return e.user_id.startsWith('guest-');
      }
      return e.user_id === userId;
    });

    return userExercises.sort((a, b) =>
      new Date(b.exercise_time) - new Date(a.exercise_time)
    );
  }

  async deleteExercise(userId, exerciseId) {
    const index = this.exercises.findIndex((e) => {
      if (userId.startsWith('guest-')) {
        return e.id === parseInt(exerciseId) && e.user_id.startsWith('guest-');
      }
      return e.id === parseInt(exerciseId) && e.user_id === userId;
    });

    if (index === -1) {
      return null;
    }

    const deleted = this.exercises.splice(index, 1)[0];
    return deleted;
  }

  // Clear all data (useful for testing)
  clear() {
    this.readings = [];
    this.meals = [];
    this.exercises = [];
    this.users.clear();
    this.readingIdCounter = 1;
    this.mealIdCounter = 1;
    this.exerciseIdCounter = 1;
  }
}

// Export a singleton instance
module.exports = new MemoryStore();
