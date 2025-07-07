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

    private final AtomicInteger clickCount = new AtomicInteger();
    private Socket socket;

    @Override
    public void start(Stage stage) throws URISyntaxException {
        // ───────────────────────────────── sockets ──────────────────────────────
        socket = IO.socket("http://localhost:3000");
        socket.on(Socket.EVENT_CONNECT, args -> {
            System.out.println("[socket] connected");
            socket.emit("join_game");
        });
        socket.on("player_clicked", args -> {
            // you can enrich UI with other players' clicks
        });
        socket.on("explosion_occurred", args -> {
           
        });
        socket.connect();

        // ─────────────────────────────── JavaFX UI ─────────────────────────────
        Canvas canvas = new Canvas(WIDTH, HEIGHT);
        GraphicsContext g = canvas.getGraphicsContext2D();

        Label counter = new Label("0 / " + MAX_CLICKS);
        counter.getStyleClass().add("h1");

        Button clearBtn = new Button("Clear");

        HBox toolbar = new HBox(8, counter, clearBtn);
        toolbar.setId("toolbar");
        toolbar.setAlignment(Pos.CENTER_LEFT);

        BorderPane root = new BorderPane(canvas);
        root.setTop(toolbar);

        Scene scene = new Scene(root, WIDTH, HEIGHT, Color.web("#0e0e10"));
        scene.getStylesheets().add(getClass().getResource("/minimal.css").toExternalForm());

        stage.setTitle("EMPLODE – burst your thoughts");
        stage.setScene(scene);
        stage.show();

        // ─────────────────────────── central shape logic ───────────────────────
        final double[] radius = {40};
        final double[] targetRadius = {40};

        canvas.setOnMouseClicked(e -> {
            int c = clickCount.incrementAndGet();
            targetRadius[0] += 6;
            counter.setText(c + " / " + MAX_CLICKS);
            socket.emit("click_shape");
            if (c >= MAX_CLICKS) {
                clickCount.set(0);
                radius[0] = 40;
                targetRadius[0] = 40;
                counter.setText("0 / " + MAX_CLICKS);
                socket.emit("explode_shape");
            }
        });

        // ───────────────────────── drawing loop (simple) ───────────────────────
        AnimationTimer timer = new AnimationTimer() {
            @Override
            public void handle(long now) {
                g.setFill(Color.web("#0e0e10"));
                g.fillRect(0, 0, WIDTH, HEIGHT);

                radius[0] += (targetRadius[0] - radius[0]) * 0.2;

                double tensionRatio = clickCount.get() / (double) MAX_CLICKS;
                Color base = Color.web("#00e2c2");
                Color tense = Color.web("#ff5c5c");
                Color current = base.interpolate(tense, tensionRatio);

                g.setFill(current);
                g.fillOval(WIDTH / 2.0 - radius[0], HEIGHT / 2.0 - radius[0], radius[0] * 2, radius[0] * 2);
            }
        };
        timer.start();
    }

    public static void main(String[] args) {
        launch(args);
    }
} 