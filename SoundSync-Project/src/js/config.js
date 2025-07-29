// Configuration settings for SyncSound Party
// Handles environment variables for different deployment environments

// Environment configuration with fallbacks
const config = {
  // Supabase configuration
  supabase: {
    url: typeof process !== 'undefined' && process.env 
      ? process.env.NEXT_PUBLIC_SUPABASE_URL 
      : window.location.hostname === 'localhost' 
        ? 'https://oixmpqqogflcznjnxzyv.supabase.co' 
        : 'https://your-project.supabase.co',
    
    anonKey: typeof process !== 'undefined' && process.env 
      ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
      : window.location.hostname === 'localhost' 
        ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9peG1wcXFvZ2ZsY3puam54enl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MTkzODcsImV4cCI6MjA2OTI5NTM4N30.QDdF9n0rPDdhIMYGKE5p9F-YaqpHqg1o3Mm7hvZmsGE' 
        : 'your-public-anon-key'
  },

  // Backend/Socket.io server configuration
  backend: {
    url: typeof process !== 'undefined' && process.env 
      ? process.env.NEXT_PUBLIC_BACKEND_URL 
      : window.location.hostname === 'localhost' 
        ? 'http://localhost:3001' 
        : 'https://your-backend-url.com'
  },

  // App configuration
  app: {
    name: 'SyncSound Party',
    version: '1.0.0',
    description: 'Transform multiple phones into a synchronized speaker system',
    maxParticipants: 50,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    supportedAudioFormats: ['mp3', 'wav', 'ogg', 'm4a', 'aac'],
    reconnectAttempts: 5,
    reconnectDelay: 2000
  },

  // Development flags
  isDevelopment: typeof process !== 'undefined' && process.env 
    ? process.env.NODE_ENV === 'development' 
    : window.location.hostname === 'localhost',

  // Feature flags
  features: {
    pwa: true,
    audioUpload: true,
    roomSharing: true,
    analytics: false // Set to true in production
  }
};

// Validation function
function validateConfig() {
  const required = [
    config.supabase.url,
    config.supabase.anonKey,
    config.backend.url
  ];

  const missing = required.filter(value => !value || value.includes('your-'));
  
  if (missing.length > 0) {
    console.warn('⚠️ Missing environment variables. Please check your configuration.');
    if (config.isDevelopment) {
      console.warn('Make sure to copy .env.example to .env.local and fill in your values.');
    }
  }
}

// Initialize validation
if (typeof window !== 'undefined') {
  validateConfig();
}

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
} else {
  window.APP_CONFIG = config;
}