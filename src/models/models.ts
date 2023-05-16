export interface Person {
	id?: string
	name: string
	username: string
}

export interface WorkSpace {
	id?: string
	name: string
}

export interface Task {
	id?: string
	title: string
	description: string
	participants?: {
		[key: string]: Person
	}
}

export interface WorkSpaceMembers {
	members: {
		[key: string]: Person
	}
}

export interface TeamGroup {
	id?: string
	createdAt: string
	workSpaces?: {
		[key: string]: WorkSpace
	}
	workSpaceMembers?: {
		[key: string]: WorkSpaceMembers
	}
	tasks?: {
		[key: string]: Task
	}
	members?: {
		[key: string]: Person
	}
}

//Example

const teamGroup: TeamGroup = {
	createdAt: '2023/04/24',
	workSpaces: {
		'1234123': {
			name: '',

		},
		'1421': {
			name: '',
		}
	},
	workSpaceMembers: {
		'desarrollo': {
			members: {
				'ouiou': {
					name: 'Hassam',
					username: 'hassam',
				}
			}
		},
		'desarrollo2': {
			members: {
				'aaaa': {
					name: 'Hassam',
					username: 'hassam',
				},
				'hola': {
					name: 'Etzael',
					username: 'Goier'
				}
			}
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
	members: {
		'werwer': {
			name: 'Ema',
			username: 'eznoel',
		},
		'uouii': {
			name: 'Hassam',
			username: 'hassam',
		},
	},
}
