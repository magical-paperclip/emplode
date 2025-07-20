package com.emplode.network;
package com.emplode.network;

import io.socket.client.IO;
import io.socket.client.Socket;

import java.net.URISyntaxException;

public class SocketManager {
    private Socket socket;

    public SocketManager(String url) throws URISyntaxException {
        socket = IO.socket(url);
    }

    public Socket getSocket() {
        return socket;
    }

    public void connect() {
        socket.connect();
    }

    public void disconnect() {
        socket.disconnect();
    }
} 