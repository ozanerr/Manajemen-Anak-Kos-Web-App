import { io } from "socket.io-client";

const URL =
    "https://manajemen-anak-kos-web-app-service-607494574887.asia-southeast1.run.app";

export const socket = io(URL, {
    autoConnect: false,
});
