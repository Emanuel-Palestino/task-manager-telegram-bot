interface TeamGroup {
    createdAt: string;
    areas: {
      [key: string]: {
        name: string;
      };
    };
    areasMembers: {
      [key: string]: {
        name: string;
        username: string;
      };
    };
    task: {
      [key: string]: {
        title: string;
        description: string;
        participants: {
          [key: string]: {
            name: string;
            username: string;
          };
        };
      };
    };
    persons: {
      [key: string]: {
        name: string;
        username: string;
      };
    };
  }
  
  export const teamGroup: TeamGroup = {
    createdAt: '2023/04/24',
    areas: {
      '1234123': {
        name: '',
      },
    },
    areasMembers: {
      'werwer': {
        name: 'Ema',
        username: 'eznoel',
      },
      'ouiou': {
        name: 'Hassam',
        username: 'hassam',
      },
    },
    task: {
      'weawea': {
        title: 'prueba',
        description: 'prueba con bot',
        participants: {
          'oiwow': {
            name: 'Hassam',
            username: 'hassam',
          },
        },
      },
    },
    persons: {
      'werwer': {
        name: 'Ema',
        username: 'eznoel',
      },
      'uouii': {
        name: 'Hassam',
        username: 'hassam',
      },
    },
  };
  