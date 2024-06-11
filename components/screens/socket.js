import io from 'socket.io-client';

const socket = io('http://192.168.11.107:1337', {
  transports: ['websocket'],
  jsonp: false,
});

export default socket;