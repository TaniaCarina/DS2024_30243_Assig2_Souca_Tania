package ro.tuc.ds2020.services;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.dtos.DeviceDetailsDTO;
import ro.tuc.ds2020.dtos.builders.DeviceBuilder;
import ro.tuc.ds2020.entities.Device;
import ro.tuc.ds2020.entities.UsersIds;
import ro.tuc.ds2020.repositories.DeviceRepository;
import ro.tuc.ds2020.repositories.UsersIdsRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DeviceService {

    private static final Logger logger = LoggerFactory.getLogger(DeviceService.class);
    private final DeviceRepository deviceRepo;
    private final UsersIdsRepository userRepo;
    private final RabbitTemplate rabbitMQ;

    @Autowired
    public DeviceService(DeviceRepository deviceRepo, RabbitTemplate rabbitMQ, UsersIdsRepository userRepo) {
        this.deviceRepo = deviceRepo;
        this.rabbitMQ = rabbitMQ;
        this.userRepo = userRepo;
    }

    public List<DeviceDTO> getAllDevices() {
        return deviceRepo.findAll().stream()
                .map(DeviceBuilder::toDeviceDTO)
                .collect(Collectors.toList());
    }

    public DeviceDetailsDTO getDeviceById(UUID deviceId) {
        return deviceRepo.findById(deviceId)
                .map(DeviceBuilder::toDeviceDetailsDTO)
                .orElseThrow(() -> {
                    logger.error("Device with ID {} not found in the database.", deviceId);
                    throw new IllegalArgumentException("Device not found with ID: " + deviceId);
                });
    }

    public UUID addDevice(DeviceDetailsDTO deviceDTO) {
        Device newDevice = DeviceBuilder.toEntity(deviceDTO);
        newDevice = deviceRepo.save(newDevice);
        logger.info("New device with ID {} has been added.", newDevice.getId());
        notifyDeviceInsert(newDevice.getId(), newDevice.getHourlyMaxConsumption());
        return newDevice.getId();
    }

    @Transactional
    public UUID updateDevice(UUID deviceId, DeviceDetailsDTO updatedDeviceDTO) {
        Device existingDevice = deviceRepo.findById(deviceId).orElseThrow(() -> {
            logger.error("Device with ID {} not found in the database.", deviceId);
            throw new IllegalArgumentException("Device not found with ID: " + deviceId);
        });

        existingDevice.setUserId(updatedDeviceDTO.getUserId());
        existingDevice.setDescription(updatedDeviceDTO.getDescription());
        existingDevice.setHourlyMaxConsumption(updatedDeviceDTO.getHourlyMaxConsumption());
        existingDevice.setAddress(updatedDeviceDTO.getAddress());
        deviceRepo.save(existingDevice);

        logger.info("Device with ID {} has been updated.", existingDevice.getId());
        notifyDeviceDelete(deviceId);
        notifyDeviceInsert(existingDevice.getId(), existingDevice.getHourlyMaxConsumption());
        return existingDevice.getId();
    }

    public void removeDevice(UUID deviceId) {
        Device deviceToDelete = deviceRepo.findById(deviceId).orElseThrow(() -> {
            logger.error("Device with ID {} not found in the database.", deviceId);
            throw new IllegalArgumentException("Device not found with ID: " + deviceId);
        });

        deviceRepo.delete(deviceToDelete);
        logger.info("Device with ID {} has been removed.", deviceId);
        notifyDeviceDelete(deviceId);
    }

    public List<DeviceDTO> getDevicesByUserId(UUID userId) {
        return deviceRepo.findDevicesByUserId(userId).stream()
                .map(DeviceBuilder::toDeviceDTO)
                .collect(Collectors.toList());
    }

    public List<DeviceDTO> getDevicesByUsername(String username) {
        UsersIds user = userRepo.findByUsername(username).orElseThrow(() -> {
            logger.error("User with username {} not found.", username);
            throw new IllegalArgumentException("User not found with username: " + username);
        });

        return getDevicesByUserId(user.getUserId());
    }

    private void notifyDeviceDelete(UUID deviceId) {
        String message = String.format("{\"operation\":\"delete\",\"deviceId\":\"%s\"}", deviceId);
        rabbitMQ.convertAndSend("SyncExchange", "Sync", message);
        logger.info("Deletion notification sent to RabbitMQ: {}", message);
    }

    private void notifyDeviceInsert(UUID deviceId, int maxConsumption) {
        String message = String.format("{\"operation\":\"insert\",\"deviceId\":\"%s\",\"max_measurement\":\"%d\"}", deviceId, maxConsumption);
        rabbitMQ.convertAndSend("SyncExchange", "Sync", message);
        logger.info("Insertion notification sent to RabbitMQ: {}", message);
    }
}
