import { io } from 'socket.io-client';

const socket = io.connect('https://sheltered-wave-17450.herokuapp.com/', {
	transportOptions: {
		polling: {
			extraHeaders: {
				'my-custom-header': 'abcd',
			},
		},
	},
	'sync disconnect on unload': true,
});

export default socket;
