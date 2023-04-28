"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* export interface TeamGroup {
  id?: string
  createdAt: string
  areas?: {
    [key: string]: {
      name: string
    }
  }
  areasMembers?: {
    [key: string]: {
      id?: string
      name: string
      username: string
    }
  }
  tasks?: {
    [key: string]: {
      id?:string
      title: string
      description: string
      participants: {
        [key: string]: {
          id?: string
          name: string
          username: string
        }
      }
    }
  }
  people?: {
    [key: string]: {
      id?:string
      name: string
      username: string
    }
  }
} */
const teamGroup = {
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
    tasks: {
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
    people: {
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
