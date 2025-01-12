package ro.tuc.ds2020.controller;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.stereotype.Component;
import org.springframework.amqp.core.Queue;
import ro.tuc.ds2020.service.DeviceService;

@Component
public class DeviceController {
    private final DeviceService deviceService;
    private final RabbitAdmin rabbitAdmin;

    public DeviceController(DeviceService deviceService, RabbitAdmin rabbitAdmin) {
        this.deviceService = deviceService;
        this.rabbitAdmin = rabbitAdmin;
        declareQueueIfNotExists("device-crud-queue");
    }

    private void declareQueueIfNotExists(String queueName) {
        if (rabbitAdmin.getQueueProperties(queueName) == null || rabbitAdmin.getQueueProperties(queueName).isEmpty()) {
            rabbitAdmin.declareQueue(new Queue(queueName));
        }
    }

    @RabbitListener(queues = "device-crud-queue")
    public void receiveMessage(String message)
    {
        String trimmedJson = message.replaceAll("[{}\"]", "");
        String[] keyValuePairs = trimmedJson.split(",");

        String type = keyValuePairs[0].split(":")[1].trim();

        switch (type) {
            case "POST":
                deviceService.registerDevice(message);
                System.out.println("Received from RabbitMQ: " + message);
                break;
            case "PUT":
                deviceService.updateDevice(message);
                System.out.println("Received from RabbitMQ: " + message);
                break;
            case "DELETE":
                deviceService.deleteDevice(message);
                System.out.println("Received from RabbitMQ: " + message);
                break;
        }
    }
}
