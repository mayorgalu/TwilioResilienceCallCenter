import io from "socket.io-client";
//Below we pass the token using SocketIo connection
class Socket {
  url = "http://localhost:3001";
  client = null;
  constructor() {
    this.client = io.connect(this.url);
  }
  addToken(token) {
    this.client = io.connect(this.url, { query: { token } });
  }
  removeToken() {
    this.client = io.connect(this.url);
  }
}

const instance = new Socket();

export default instance;
