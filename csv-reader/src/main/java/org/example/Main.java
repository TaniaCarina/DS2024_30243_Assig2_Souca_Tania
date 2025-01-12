package org.example;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Main {
    public static void main(String[] args) {
        String deviceId = args[0];

        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost"); // RabbitMQ server host

        String csvPath = "src/main/resources/sensor.csv";
        String queueName = "measurements-queue";
        try (Connection connection = factory.newConnection(); Channel channel = connection.createChannel())
        {
            channel.queueDeclare(queueName, true, false, false, null);

            try (BufferedReader br = new BufferedReader(new FileReader(csvPath))) {
                String line;
                while ((line = br.readLine()) != null) {
                    String value = line.trim();
                    LocalDateTime currentDateTime = LocalDateTime.now();

                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SS");
                    String timestamp = currentDateTime.format(formatter);

                    StringBuilder sb = new StringBuilder();
                    sb.append("{");
                    sb.append("\"timestamp\": "  + timestamp + ",");
                    sb.append("\"device_id\": " + deviceId + ",");
                    sb.append("\"measurement_value\": " + value );
                    sb.append("}");

                    channel.basicPublish("", queueName, null, sb.toString().getBytes());
                    System.out.println("Sent to RabbitMQ: " + sb.toString());
                    Thread.sleep(10000);
                }
            } catch (IOException e) {
                System.out.println("File not found");
                e.printStackTrace();
            }
        } catch (Exception e) {
            System.out.println("Connection to RabbitMQ failed");
            e.printStackTrace();
        }
    }
}