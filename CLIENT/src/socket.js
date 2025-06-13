import { io } from "socket.io-client";

//untuk web socker url jadi "/"
//karena url di setting di vite.config.js
const URL = "/";

export const socket = io(URL, {
    autoConnect: false,
});
