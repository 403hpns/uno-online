export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'pl',
  fallbackLocale: 'en',
  messages: {
    en: {
      menu: {
        form: {
          nickname: {
            label: 'Nickname',
            playBtn: 'Play',
          },
          lobbyCode: {
            label: 'Lobby code',
            joinBtn: 'Join',
            createBtn: 'Create own lobby',
          },
        },
      },
      lobby: {
        title: 'Room',
        loading: 'Loading data...',
        playerList: {
          label: 'Players',
          you: 'You',
        },
        playBtn: {
          waiting: 'Waiting for players',
          start: 'Start the game',
        },
      },
    },
    pl: {
      menu: {
        form: {
          nickname: {
            label: 'Nazwa',
            playBtn: 'Graj',
          },
          lobbyCode: {
            label: 'Kod lobby',
            joinBtn: 'Dołącz',
            createBtn: 'Stwórz lobby',
          },
        },
      },
      lobby: {
        title: 'Pokój gry',
        loading: 'Ładowanie danych...',
        playerList: {
          label: 'Gracze',
          you: 'Ty',
        },
        playBtn: {
          waiting: 'Oczekiwanie na graczy',
          start: 'Rozpocznij grę',
        },
      },
    },
  },
}));
