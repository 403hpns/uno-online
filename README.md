# UNO Online 🃏

Welcome to **UNO Online**, a real-time multiplayer implementation of the classic card game UNO, built with modern web technologies. This project allows players to create lobbies, invite friends, and play UNO together in real-time.

---

## 🚀 Features

- **Real-time multiplayer gameplay**: Play UNO with friends or random players online.
- **Lobby system**: Create or join lobbies with unique codes.
- **Player authentication**: Unique tokens ensure secure and persistent player identification.
- **Interactive gameplay**: Draw cards, play cards, and interact with other players in real-time.
- **Responsive design**: Play on desktop or mobile devices.

---

## 🛠️ Technologies Used

- **Frontend**: 
  - [Nuxt.js](https://nuxtjs.org/) - A Vue.js framework for building modern web applications.
  - [Socket.IO Client](https://socket.io/) - Real-time communication between the client and server.
  
- **Backend**:
  - [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient and scalable server-side applications.
  - [Socket.IO](https://socket.io/) - Enables real-time, bidirectional communication between clients and the server.
  - [Redis](https://redis.io/) - Used for caching player sessions and game states.

- **Other Tools**:
  - [TypeScript](https://www.typescriptlang.org/) - Adds type safety and improves developer productivity.
  - [Vite](https://vitejs.dev/) - Fast build tool for modern web development.
  - [Docker](https://www.docker.com/) - Containerization for easy deployment and scalability.

---

## 🎮 How to Play

1. **Join the Game**:
   - Enter your nickname and join a lobby or create a new one.
   - Share the lobby code with friends to invite them.

2. **Start the Game**:
   - Once all players are ready, the game begins.
   - Follow the rules of UNO to play cards, draw cards, and challenge your opponents.

3. **Win the Game**:
   - Be the first player to get rid of all your cards to win the round.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Docker (optional, for Redis)
- Redis (can be installed locally or via Docker)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/uno-online.git
   cd uno-online
2. **Install dependencies**
   ```bash
   pnpm install
   ```
3. **Run Docker**
   ```bash
   docker compose up -d
   ```
4. **Start development server**
   ```bash
   pnpm dev
   ```
5. **Open the game**
   Visit `http://localhost:3000` in your browser to start playing.

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push to your fork.
4. Submit a pull request with a detailed description of your changes.

      
