// SyncSound Party Main Application - Compatible with existing services
// Uses the same Supabase and Socket.io setup with improved organization

// Initialize Supabase client using configuration
let supabase = null;
let socket = null;
let currentUser = null;
let currentRoom = null;

// DOM elements
const loadingScreen = document.getElementById('loading-screen');
const authScreen = document.getElementById('auth-screen');
const mainScreen = document.getElementById('main-screen');
const roomScreen = document.getElementById('room-screen');

// Auth elements
const loginTab = document.querySelector('[data-tab="login"]');
const signupTab = document.querySelector('[data-tab="signup"]');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// Dashboard elements
const usernameDisplay = document.getElementById('username-display');
const logoutBtn = document.getElementById('logout-btn');
const createRoomBtn = document.getElementById('create-room-btn');
const joinRoomBtn = document.getElementById('join-room-btn');
const roomCodeInput = document.getElementById('room-code-input');

// Room elements
const roomNameEl = document.getElementById('room-name');
const roomCodeEl = document.getElementById('room-code');
const participantCountEl = document.getElementById('participant-count');
const participantsCountNumber = document.getElementById('participants-count');
const participantsList = document.getElementById('participants-list');
const leaveRoomBtn = document.getElementById('leave-room-btn');

// Initialize the application
function initializeApp() {
  console.log('🚀 Initializing SyncSound Party...');
  
  // Get configuration
  const config = window.APP_CONFIG;
  
  if (!config) {
    console.error('❌ Configuration not loaded');
    showError('Failed to load configuration');
    return;
  }
  
  // Initialize Supabase
  if (typeof window.supabase !== 'undefined') {
    const { createClient } = window.supabase;
    supabase = createClient(config.supabase.url, config.supabase.anonKey);
    console.log('✅ Supabase initialized');
  } else {
    console.error('❌ Supabase library not loaded');
    showError('Failed to initialize Supabase');
    return;
  }
  
  // Initialize Socket.io
  if (typeof io !== 'undefined') {
    socket = io(config.backend.url, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: config.app.reconnectAttempts,
      reconnectionDelay: config.app.reconnectDelay
    });
    
    setupSocketListeners();
    console.log('✅ Socket.io initialized');
  } else {
    console.warn('⚠️ Socket.io not available - real-time features will be limited');
  }
  
  // Setup event listeners
  setupEventListeners();
  
  // Check initial authentication state
  checkAuthState();
  
  console.log('✅ Application initialized');
}

// Setup event listeners (same as your original code)
function setupEventListeners() {
  // Auth Tab switching
  if (loginTab && signupTab) {
    loginTab.addEventListener('click', () => {
      loginTab.classList.add('active');
      signupTab.classList.remove('active');
      loginForm.classList.add('active');
      signupForm.classList.remove('active');
    });

    signupTab.addEventListener('click', () => {
      signupTab.classList.add('active');
      loginTab.classList.remove('active');
      signupForm.classList.add('active');
      loginForm.classList.remove('active');
    });
  }

  // Sign Up Handler
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = signupForm.querySelector('input[type="text"]').value.trim();
      const email = signupForm.querySelector('input[type="email"]').value.trim();
      const password = signupForm.querySelector('input[type="password"]').value.trim();

      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: { data: { username } }
      });
      
      if (error) return toast(error.message);
      toast('Signup successful, confirmation email sent');
    });
  }

  // Login Handler
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('input[type="email"]').value.trim();
      const password = loginForm.querySelector('input[type="password"]').value.trim();

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return toast(error.message);
      handleAuthChange(data.user);
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await supabase.auth.signOut();
    });
  }

  // Create Room
  if (createRoomBtn) {
    createRoomBtn.addEventListener('click', async () => {
      const roomCode = generateRoomCode();
      const { data, error } = await supabase.from('audio_rooms').insert({
        name: `Room-${roomCode}`,
        code: roomCode,
        host_id: currentUser.id,
        status: 'waiting'
      }).select().single();
      
      if (error) return toast(error.message);
      joinRoom(data);
    });
  }

  // Join Room
  if (joinRoomBtn) {
    joinRoomBtn.addEventListener('click', async () => {
      const code = roomCodeInput.value.trim().toUpperCase();
      if (!code) return toast('Enter room code');
      
      const { data, error } = await supabase.from('audio_rooms')
        .select('*')
        .eq('code', code)
        .eq('status', 'waiting')
        .single();
        
      if (error) return toast('Room not found');
      joinRoom(data);
    });
  }

  // Leave Room
  if (leaveRoomBtn) {
    leaveRoomBtn.addEventListener('click', async () => {
      if (!currentRoom) return;
      
      await supabase.from('room_participants')
        .delete()
        .match({ room_id: currentRoom.id, user_id: currentUser.id });
        
      if (socket) {
        socket.emit('leave-room', { roomId: currentRoom.id });
      }
      
      currentRoom = null;
      showScreen(mainScreen);
    });
  }

  // Room code input improvements
  if (roomCodeInput) {
    roomCodeInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase().slice(0, 6);
    });
    
    roomCodeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        joinRoomBtn.click();
      }
    });
  }
}

// Setup Socket.io listeners
function setupSocketListeners() {
  socket.on('connect', () => {
    console.log('✅ Connected to server');
    updateConnectionStatus(true);
  });
  
  socket.on('disconnect', () => {
    console.log('❌ Disconnected from server');
    updateConnectionStatus(false);
  });
  
  socket.on('room-updated', ({ participants }) => {
    if (participantsCountNumber) {
      participantsCountNumber.textContent = participants;
    }
  });
  
  socket.on('participant-joined', (data) => {
    toast(`${data.username || 'Someone'} joined the room`);
    loadParticipants(currentRoom?.id);
  });
  
  socket.on('participant-left', (data) => {
    toast(`${data.username || 'Someone'} left the room`);
    loadParticipants(currentRoom?.id);
  });
  
  socket.on('error', (error) => {
    console.error('Socket error:', error);
    toast('Connection error occurred');
  });
}

// Authentication functions (same as your original)
function handleAuthChange(user) {
  currentUser = user;
  if (!user) {
    showScreen(authScreen);
  } else {
    if (usernameDisplay) {
      usernameDisplay.textContent = user.user_metadata?.username || user.email;
    }
    showScreen(mainScreen);
  }
}

async function checkAuthState() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    handleAuthChange(session?.user || null);
    
    // Listen to auth state changes
    supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(session?.user || null);
    });
  } catch (error) {
    console.error('Auth check error:', error);
    showScreen(authScreen);
  }
}

// Room functions (same as your original)
async function joinRoom(room) {
  currentRoom = room;
  
  // Insert participant record
  await supabase.from('room_participants').insert({ 
    room_id: room.id, 
    user_id: currentUser.id, 
    is_host: room.host_id === currentUser.id 
  });

  // Join Socket.io room
  if (socket) {
    socket.emit('join-room', { 
      roomId: room.id, 
      userId: currentUser.id, 
      isHost: room.host_id === currentUser.id,
      username: currentUser.user_metadata?.username || currentUser.email
    });
  }

  // Update UI
  if (roomNameEl) roomNameEl.textContent = room.name;
  if (roomCodeEl) roomCodeEl.textContent = `Code: ${room.code}`;
  
  // Show host controls if user is host
  const hostControls = document.getElementById('host-controls');
  const participantView = document.getElementById('participant-view');
  
  if (room.host_id === currentUser.id) {
    if (hostControls) hostControls.style.display = 'block';
    if (participantView) participantView.style.display = 'none';
  } else {
    if (hostControls) hostControls.style.display = 'none';
    if (participantView) participantView.style.display = 'block';
  }
  
  showScreen(roomScreen);
  loadParticipants(room.id);
}

async function loadParticipants(roomId) {
  if (!roomId || !participantsList) return;
  
  try {
    const { data } = await supabase
      .from('room_participants')
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('room_id', roomId);
    
    if (participantsCountNumber) {
      participantsCountNumber.textContent = data.length;
    }
    
    participantsList.innerHTML = '';
    
    data.forEach(p => {
      const el = document.createElement('div');
      el.className = 'participant-item';
      
      const username = p.user?.user_metadata?.username || p.user?.email || 'Unknown';
      const isHost = p.is_host;
      
      el.innerHTML = `
        <span class="participant-name">${username}</span>
        ${isHost ? '<span class="host-badge">Host</span>' : ''}
      `;
      
      participantsList.appendChild(el);
    });
  } catch (error) {
    console.error('Error loading participants:', error);
  }
}

// Utility Functions (same as your original)
function showScreen(screen) {
  [loadingScreen, authScreen, mainScreen, roomScreen].forEach(s => {
    if (s) s.style.display = 'none';
  });
  if (screen) screen.style.display = 'block';
}

function toast(message) {
  const container = document.getElementById('notifications');
  if (!container) return;
  
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = message;
  container.appendChild(t);
  setTimeout(() => {
    if (container.contains(t)) {
      container.removeChild(t);
    }
  }, 4000);
}

function showError(message) {
  toast(message);
}

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function updateConnectionStatus(connected) {
  const statusIndicator = document.querySelector('.connection-status .status-indicator');
  const statusText = document.querySelector('.connection-status .status-text');
  
  if (statusIndicator && statusText) {
    if (connected) {
      statusIndicator.style.backgroundColor = '#12d640';
      statusText.textContent = 'Connected';
    } else {
      statusIndicator.style.backgroundColor = '#ff4444';
      statusText.textContent = 'Disconnected';
    }
  }
}

// Listen to presence via Realtime (same as your original)
function setupRealtimeSubscriptions() {
  if (!currentRoom) return;
  
  supabase.channel('room_participants')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'room_participants' 
    }, payload => {
      if (payload.new?.room_id === currentRoom?.id || payload.old?.room_id === currentRoom?.id) {
        loadParticipants(currentRoom.id);
      }
    })
    .subscribe();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  showScreen(loadingScreen);
  
  // Wait for dependencies to be available
  const checkDependencies = () => {
    if (typeof window.supabase !== 'undefined' && window.APP_CONFIG) {
      initializeApp();
    } else {
      setTimeout(checkDependencies, 100);
    }
  };
  
  checkDependencies();
});

// Handle page visibility changes for better UX
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && currentRoom) {
    // Refresh participants when app becomes visible
    loadParticipants(currentRoom.id);
  }
});

// Export for debugging in development
if (window.APP_CONFIG?.isDevelopment) {
  window.debugApp = {
    supabase,
    socket,
    currentUser,
    currentRoom,
    config: window.APP_CONFIG
  };
}