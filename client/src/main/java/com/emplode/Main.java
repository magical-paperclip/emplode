package com.emplode;

import com.emplode.network.SocketManager;
import io.socket.client.Ack;
import io.socket.client.IO;
import io.socket.client.Socket;
import javafx.animation.AnimationTimer;
import javafx.application.Application;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.paint.Color;
import javafx.stage.Stage;

import java.net.URISyntaxException;
import java.util.concurrent.atomic.AtomicInteger;

public class Main extends Application {

    private static final int WIDTH = 800;
    private static final int HEIGHT = 600;
    private static final int MAX_CLICKS = 10;

    private final AtomicInteger clicks = new AtomicInteger();
    private Socket connection;

    @Override
    public void start(Stage window) throws URISyntaxException {
        connection = IO.socket("http://localhost:3000");
        connection.on(Socket.EVENT_CONNECT, args -> {
            System.out.println("[socket] connected");
            connection.emit("join_game");
        });
        connection.on("player_clicked", args -> {
        });
        connection.on("explosion_occurred", args -> {
           
        });
        connection.connect();

        Canvas board = new Canvas(WIDTH, HEIGHT);
        GraphicsContext draw = board.getGraphicsContext2D();

        Label display = new Label("0 / " + MAX_CLICKS);
        display.getStyleClass().add("h1");

        Button reset = new Button("Clear");

        HBox controls = new HBox(8, display, reset);
        controls.setId("toolbar");
        controls.setAlignment(Pos.CENTER_LEFT);

        BorderPane layout = new BorderPane(board);
        layout.setTop(controls);

        Scene view = new Scene(layout, WIDTH, HEIGHT, Color.web("#0e0e10"));
        view.getStylesheets().add(getClass().getResource("/minimal.css").toExternalForm());

        window.setTitle("EMPLODE – burst your thoughts");
        window.setScene(view);
        window.show();

        final double[] size = {40};
        final double[] targetSize = {40};

        board.setOnMouseClicked(e -> {
            int count = clicks.incrementAndGet();
            targetSize[0] += 6;
            display.setText(count + " / " + MAX_CLICKS);
            connection.emit("click_shape");
            if (count >= MAX_CLICKS) {
                clicks.set(0);
                size[0] = 40;
                targetSize[0] = 40;
                display.setText("0 / " + MAX_CLICKS);
                connection.emit("explode_shape");
            }
        });

        AnimationTimer loop = new AnimationTimer() {
            @Override
            public void handle(long now) {
                draw.setFill(Color.web("#0e0e10"));
                draw.fillRect(0, 0, WIDTH, HEIGHT);

                size[0] += (targetSize[0] - size[0]) * 0.2;

                double tension = clicks.get() / (double) MAX_CLICKS;
                Color calm = Color.web("#00e2c2");
                Color angry = Color.web("#ff5c5c");
                Color current = calm.interpolate(angry, tension);

                draw.setFill(current);
                draw.fillOval(WIDTH / 2.0 - size[0], HEIGHT / 2.0 - size[0], size[0] * 2, size[0] * 2);
            }
        };
        loop.start();
    }

    public static void main(String[] args) {
        launch(args);
    }
} 