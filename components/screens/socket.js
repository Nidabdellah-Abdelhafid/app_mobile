// import { useEffect } from 'react';
import io from 'socket.io-client';
import { URL_BACKEND } from "api";

const socket = io(URL_BACKEND, {
  transports: ['websocket'],
  jsonp: false,
});


export default socket;