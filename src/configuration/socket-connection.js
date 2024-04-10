import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
const TOKEN = localStorage.getItem("fr_token");
// console.log("SOCKET_URL", SOCKET_URL)
// console.log("Socket token", localStorage.getItem("fr_token"))

const connectionOption = {
    transports: ["websocket"], // use WebSocket first, if available
}

if (TOKEN) {
    connectionOption.auth = {token: TOKEN};
}

const socket = io(SOCKET_URL, connectionOption);

socket.on('connect', function () {
    if (localStorage.getItem("fr_token")) {
        socket.emit('join', {token: localStorage.getItem("fr_token")});
    }
});

socket.on("connect_error", (e) => {
    //console.log("There Is a connection Error in helper", e);
    socket.io.opts.transports = ["websocket", "polling"];
    socket.auth = {token: localStorage.getItem("fr_token")}
});

export default socket