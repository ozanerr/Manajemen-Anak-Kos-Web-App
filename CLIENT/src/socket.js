import { io } from "socket.io-client";

const URL = "https://manajemen-anak-kos-web-app-production.up.railway.app/";

export const socket = io(URL, {
    autoConnect: false,
});
