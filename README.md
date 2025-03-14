# UNO Online [![wakatime](https://wakatime.com/badge/user/053506b8-2534-4978-816c-49eb1cab4ac9/project/8b684335-2214-4dc1-91f6-d27d1381299b.svg)](https://wakatime.com/badge/user/053506b8-2534-4978-816c-49eb1cab4ac9/project/8b684335-2214-4dc1-91f6-d27d1381299b) ![Deploy workflow](https://github.com/403hpns/uno-online/actions/workflows/deploy.yml/badge.svg)

Welcome to **UNO Online**, a real-time multiplayer implementation of the classic card game UNO, built with modern web technologies. This project allows players to create lobbies, invite friends, and play UNO together in real-time.

> [!IMPORTANT]  
> This project is still in development. Please be aware of any existing bugs or missing features.

---

## 🎮 Live demo

You can already try out a live demo of the game in production! Just click the link below, create a lobby, and invite a friend.

> [!TIP]  
> Player data is saved in your browser's **localStorage**. If you want to play solo (against yourself), open another browser or an incognito tab.

https://403hpns.dev/projects/uno/

---

## 🚀 Features

- **Real-time multiplayer gameplay**: Play UNO with friends.
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

- Node.js
- Docker (optional, for Redis)
- Redis (can be installed locally or via Docker)

> [!NOTE]  
> By default, Redis is disabled, and NestJS uses the default cache manager. To use Redis instead, run `docker-compose up -d` and rename the `.env.example` file to `.env`. Make sure the `USE_REDIS` variable is set to `true`.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/403hpns/uno-online.git
   cd uno-online
2. **Install dependencies**
   ```bash
   pnpm install
   ```
3. **Run Docker** (optional)
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

## 📂 Assets
Special thanks to the authors of the assets used in this project.

- UNO Asset Pack - https://alexder.itch.io/uno-card-game-asset-pack

      
