import { io } from 'socket.io-client';

const socket = io.connect('http://localhost:8001', {
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
