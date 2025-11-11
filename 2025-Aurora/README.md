# AuroraFlow - AI-Driven Diabetes Management Application

An accessible, affordable diabetes management app serving low-income, rural, and minority populations who cannot afford expensive CGM devices.

## Mission

Build an AI-powered diabetes management app that works with affordable fingerstick glucose meters ($20-40) instead of requiring expensive CGMs ($2,500-6,000/year), with full accessibility for visually impaired, elderly, and low-literacy users.

## Project Structure

```
2025-Aurora/
├── .claude/                    # Project context for Claude Code
├── auroraflow-mobile/         # React Native mobile app (Expo)
│   ├── src/
│   │   ├── screens/          # Screen components
│   │   │   ├── auth/        # Login, Signup screens
│   │   │   ├── dashboard/   # Main dashboard
│   │   │   ├── glucose/     # Glucose logging screens
│   │   │   └── settings/    # Settings screens
│   │   ├── components/       # Reusable components
│   │   ├── navigation/       # Navigation configuration
│   │   ├── services/        # API, Firebase, storage services
│   │   ├── constants/       # Theme, colors, config
│   │   └── utils/           # Helper functions
│   └── package.json
└── README.md
```

## Current Status

**Phase 1: Authentication (Days 1-2)** ✅ Completed
- ✅ Project initialization with Expo
- ✅ Folder structure set up
- ✅ Core dependencies installed
- ✅ Theme and constants configured
- ✅ Navigation structure implemented
- ✅ Login screen created with accessibility features
- ✅ Signup screen created with validation

**Next Steps:**
- Integrate Firebase Authentication
- Add password reset functionality
- Build glucose logging screens
- Implement AI prediction model

## Tech Stack

**Frontend:**
- React Native with Expo
- React Navigation
- React Native Paper (Material Design)
- AsyncStorage for offline storage

**Backend:**
- Node.js with Express.js (planned)
- Firebase Authentication
- PostgreSQL database (planned)

**AI/ML:**
- TensorFlow.js or Python scikit-learn (planned)
- ARIMA or LSTM models for glucose prediction

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Isap31/2025-Aurora.git
cd 2025-Aurora
```

2. Install dependencies:
```bash
cd auroraflow-mobile
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your device:
- **iOS Simulator:** Press `i` in the terminal
- **Android Emulator:** Press `a` in the terminal
- **Physical Device:** Scan the QR code with Expo Go app

## Development Principles

1. **Accessibility First** - Every feature works for visually impaired users
2. **Security & Privacy** - HIPAA-ready encryption, secure authentication
3. **Offline First** - App works without internet connection
4. **Simple Before Complex** - Focus on core value proposition
5. **Test with Real Users** - Iterate based on real-world feedback

## MVP Timeline (15 Days)

- **Days 1-2:** Authentication (✅ Completed)
- **Days 3-5:** Glucose Logging
- **Days 6-8:** Basic AI Prediction
- **Days 9-11:** Voice Assistant
- **Days 12-13:** Accessibility Features
- **Days 14-15:** Dashboard & Polish

## Success Metrics

- 100 beta users signed up
- 60% weekly active users (3+ days/week)
- Average 4+ glucose logs per user per week
- 70%+ prediction accuracy
- Voice assistant 90%+ command success rate
- All accessibility features functional

## Contributing

This is a senior project for healthcare innovation. For more details, see `.claude/PROJECT_CONTEXT.md`.

## License

[To be determined]

---

**Last Updated:** November 10, 2025
**Project Lead:** BIS Senior, Healthcare Innovation Focus
