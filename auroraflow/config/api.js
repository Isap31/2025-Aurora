// API Configuration
// For development on a physical device, replace 'localhost' with your computer's IP address
// You can find your IP by running 'ipconfig getifaddr en0' on Mac or 'ipconfig' on Windows

// Development: Use your machine's local IP address (e.g., '192.168.1.100')
// Production: Use your deployed backend URL
const getApiUrl = () => {
  if (__DEV__) {
    // iOS Simulator needs 127.0.0.1 instead of localhost
    // For physical devices, use your machine's IP address (e.g., '192.168.1.100')
    return 'http://127.0.0.1:3000/api';
  } else {
    // In production, use your deployed backend URL
    return 'https://your-production-api.com/api';
  }
};

export const API_BASE_URL = getApiUrl();
export const API_AUTH_URL = `${API_BASE_URL}/auth`;
export const API_GLUCOSE_URL = `${API_BASE_URL}/glucose`;

// Note: To run on a physical device during development:
// 1. Find your computer's IP address:
//    - Mac: Run 'ipconfig getifaddr en0' in terminal
//    - Windows: Run 'ipconfig' and look for IPv4 Address
// 2. Replace 'localhost' above with your IP (e.g., 'http://192.168.1.100:3000/api')
// 3. Make sure your phone and computer are on the same network
