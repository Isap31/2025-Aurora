# AuroraFlow - AI-Driven Diabetes Management Application

## Mission
Build an accessible, affordable diabetes management app serving low-income, rural, and minority populations who cannot afford expensive CGM devices ($2,500-6,000/year).

## The Problem We're Solving
- 38.4 million Americans have diabetes, costing $413 billion annually
- CGMs are inaccessible to 87% of Type 2 diabetics due to cost
- Black Americans: 75% higher diabetes risk than White Americans
- Low-income individuals: 56% higher diabetes risk
- 1,057 Americans die daily from diabetes complications

## Core Value Proposition
Predictive AI-powered diabetes management that works with affordable fingerstick glucose meters ($20-40) instead of requiring expensive CGMs, with full accessibility for visually impaired, elderly, and low-literacy users.

## Technical Stack

### Frontend
- React Native (cross-platform iOS & Android)
- React Navigation for routing
- React Native Paper for Material Design components
- AsyncStorage for local data persistence

### Backend
- Node.js with Express.js
- RESTful API architecture
- JWT authentication

### Database
- PostgreSQL for production
- User tables: users, glucose_readings, predictions, user_preferences

### AI/ML
- TensorFlow.js or Python scikit-learn
- ARIMA or LSTM models for glucose prediction
- Training on synthetic data initially, real user data over time

### Voice Features
- React Native Voice (speech-to-text)
- React Native TTS (text-to-speech)
- Conversational AI using simple rule-based system (expand to LLM later)

### Authentication & Security
- Firebase Authentication (email/password)
- HIPAA-ready encryption
- Secure token management

### Hosting & Deployment
- Backend: AWS EC2 or Google Cloud Run
- Database: AWS RDS or Google Cloud SQL
- Frontend: Expo for React Native deployment

## MVP Feature Scope

### Phase 1: Core Features (15 days)
1. **Authentication** (Days 1-2)
   - Email/password signup and login
   - Password reset
   - Secure token storage

2. **Glucose Logging** (Days 3-5)
   - Manual glucose entry (20-600 mg/dL)
   - Date/time selection
   - Optional notes
   - History view with 7-day graph

3. **Basic AI Prediction** (Days 6-8)
   - Simple time-series model (ARIMA or basic LSTM)
   - Predict hypo/hyperglycemia risk for next 4 hours
   - Display confidence levels
   - Risk categorization (low/moderate/high)

4. **Voice Assistant** (Days 9-11)
   - Text-to-speech for reading glucose levels
   - Speech-to-text for logging: "My glucose is 142"
   - Simple voice commands: "What's my glucose?" "What's my prediction?"
   - Conversational responses

5. **Accessibility Features** (Days 12-13)
   - Large text mode toggle (150% size)
   - High contrast mode
   - Screen reader compatibility (ARIA labels)
   - Voice navigation for all primary functions

6. **Dashboard & Polish** (Days 14-15)
   - Main dashboard with latest reading
   - Trend indicators (↑ ↓ →)
   - Prediction display with risk level
   - Simple 7-day graph
   - Settings screen

## Code Architecture ## Development Principles

### 1. Accessibility First
- Every feature must work for visually impaired users
- Voice navigation for all primary functions
- Large text and high contrast modes
- Screen reader compatibility

### 2. Security & Privacy
- All health data encrypted at rest and in transit
- HIPAA-ready architecture (even for MVP)
- Never log sensitive health information
- Secure authentication tokens

### 3. Offline First
- App works without internet connection
- Local data storage with AsyncStorage
- Sync to cloud when connection available
- Queue failed API calls for retry

### 4. Simple Before Complex
- Start with basic features that work
- Iterate based on user feedback
- Don't over-engineer
- Focus on core value proposition

### 5. Test with Real Users
- Get feedback from people with diabetes early
- Test accessibility features with visually impaired users
- Iterate quickly based on real-world usage

## Data Models

### User
```javascript
{
  id: string,
  email: string,
  name: string,
  created_at: timestamp,
  preferences: {
    target_range: { min: 70, max: 180 },
    units: "mg/dL",
    large_text: boolean,
    high_contrast: boolean,
    voice_enabled: boolean
  }
}
```

### GlucoseReading
```javascript
{
  id: string,
  user_id: string,
  glucose_value: number (20-600),
  timestamp: timestamp,
  notes: string (optional),
  created_at: timestamp
}
```

### Prediction
```javascript
{
  id: string,
  user_id: string,
  predicted_value: number,
  confidence: number (0-1),
  prediction_type: "hypoglycemia" | "hyperglycemia" | "normal",
  risk_level: "low" | "moderate" | "high",
  for_datetime: timestamp,
  message: string,
  created_at: timestamp
}
```

## API Endpoints

### Authentication
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/reset-password

### Glucose Readings
- GET /api/glucose (get user's readings)
- POST /api/glucose (create new reading)
- GET /api/glucose/:id
- PUT /api/glucose/:id
- DELETE /api/glucose/:id

### Predictions
- GET /api/predictions (get predictions)
- POST /api/predictions/generate (trigger new prediction)

### User
- GET /api/user/profile
- PUT /api/user/profile
- PUT /api/user/preferences

## Success Metrics

### MVP Success Criteria
- ✅ 100 beta users signed up
- ✅ 60% weekly active users (using app 3+ days/week)
- ✅ Average 4+ glucose logs per user per week
- ✅ 70%+ prediction accuracy
- ✅ Voice assistant works for 90%+ of commands
- ✅ All accessibility features functional

### Clinical Goals (6-month pilot)
- 0.5-1.0% average A1C reduction
- 30% reduction in reported hypoglycemic episodes
- 80% user satisfaction score

## Development Commands
```bash
# Frontend (React Native)
npm install
npm start                    # Start Expo
npm run ios                  # Run on iOS simulator
npm run android              # Run on Android emulator

# Backend (Node.js)
npm install
npm run dev                  # Start with nodemon
npm test                     # Run tests

# ML Model (Python)
pip install -r requirements.txt
python train_model.py        # Train model
python predict.py            # Test predictions
```

## Environment Variables

### Frontend (.env) ### Backend (.env) ## Next Steps

1. Initialize React Native project with Expo
2. Set up folder structure
3. Install dependencies
4. Create authentication screens
5. Set up Firebase Authentication
6. Build glucose logging UI
7. Implement AI prediction model
8. Add voice assistant features
9. Implement accessibility features
10. Polish and test MVP

## Questions to Ask During Development

- Is this feature accessible to visually impaired users?
- Does this work offline?
- Is this data encrypted?
- Is this the simplest implementation that works?
- Would a user with low health literacy understand this?

## Resources & Documentation

- React Native: https://reactnative.dev/
- TensorFlow.js: https://www.tensorflow.org/js
- Diabetes data sources: NHANES, Tidepool
- HIPAA compliance: https://www.hhs.gov/hipaa

---

Last Updated: November 10, 2025
Project Lead: BIS Senior, Healthcare Innovation Focus
