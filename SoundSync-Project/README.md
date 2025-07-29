# SyncSound Party 🎵

Transform multiple phones into a synchronized speaker system for parties and gatherings.

## 🚀 Live Demo

Visit the live app: [https://syncsound-party.vercel.app](https://syncsound-party.vercel.app)

## ✨ Features

- **Real-time Audio Synchronization** - Multiple devices play in perfect sync
- **Room-based Sessions** - Create or join audio rooms with simple codes
- **User Authentication** - Secure login with Supabase Auth
- **Host Controls** - Upload and control playback for all participants
- **Participant View** - Join existing sessions and control local volume
- **Progressive Web App** - Install on mobile devices for native-like experience
- **Responsive Design** - Works seamlessly on all device sizes

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Socket.io for real-time communication
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (Frontend)
- **Real-time**: Supabase Realtime + Socket.io

## 📁 Project Structure

```
syncsound-party/
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── README.md                       # Project documentation
├── package.json                    # NPM configuration
├── vercel.json                     # Vercel deployment config
├── public/                         # Static assets
│   ├── index.html                  # Main HTML file
│   ├── manifest.json              # PWA manifest
│   └── icons/                     # App icons
├── src/                           # Source code
│   ├── js/                        # JavaScript files
│   │   ├── app.js                 # Main application logic
│   │   └── config.js              # Configuration settings
│   └── css/                       # Stylesheets
│       └── main.css               # Main styles
└── docs/                          # Documentation
    └── deployment.md              # Deployment guide
```

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/syncsound-party.git
cd syncsound-party
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Update the configuration in `src/js/config.js`:

```javascript
// Replace these with your actual values
const config = {
  supabase: {
    url: 'https://your-project.supabase.co',
    anonKey: 'your-public-anon-key'
  },
  backend: {
    url: 'https://your-backend-url.com'
  }
};
```

### 4. Setup Supabase Database

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run this SQL in the Supabase SQL Editor:

```sql
-- Create audio_rooms table
CREATE TABLE audio_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  host_id UUID NOT NULL,
  status TEXT DEFAULT 'waiting',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create room_participants table
CREATE TABLE room_participants (
  room_id UUID REFERENCES audio_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_host BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (room_id, user_id)
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE room_participants;
```

3. Enable Row Level Security and add authentication policies

### 5. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

## 🌐 Deployment

### Deploy to Vercel

1. **Connect to GitHub**
   - Push your code to GitHub
   - Connect your repository to Vercel

2. **Set Environment Variables in Vercel**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

### Backend Setup (Socket.io Server)

You'll need a separate backend server for real-time communication. Deploy to:

- **Railway** (Recommended)
- **Heroku** 
- **DigitalOcean**
- **Any Node.js hosting service**

Example backend implementation needed:

```javascript
const io = require('socket.io')(server, {
  cors: { origin: "https://your-frontend-url.vercel.app" }
});

io.on('connection', (socket) => {
  socket.on('join-room', (data) => {
    socket.join(data.roomId);
    socket.to(data.roomId).emit('participant-joined', data);
  });
  
  socket.on('leave-room', (data) => {
    socket.leave(data.roomId);
    socket.to(data.roomId).emit('participant-left', data);
  });
});
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase public anon key | Yes |
| `NEXT_PUBLIC_BACKEND_URL` | Your Socket.io server URL | Yes |

### Supabase Setup

1. **Authentication**: Enable email authentication
2. **Database**: Run the provided SQL schema
3. **Realtime**: Enable for `room_participants` table
4. **Row Level Security**: Add policies for authenticated users

## 📱 PWA Features

- Install on mobile devices
- Offline caching of static assets
- Native-like experience
- Push notifications (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [https://syncsound-party.vercel.app](https://syncsound-party.vercel.app)
- **Documentation**: [docs/deployment.md](docs/deployment.md)
- **Supabase**: [https://supabase.com](https://supabase.com)
- **Vercel**: [https://vercel.com](https://vercel.com)

## 📞 Support

If you have any questions or need help setting up the project:

1. Check the [deployment guide](docs/deployment.md)
2. Create an issue on GitHub
3. Contact the maintainers

---

Made with ❤️ for synchronized audio experiences