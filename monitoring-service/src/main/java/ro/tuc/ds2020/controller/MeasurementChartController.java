package ro.tuc.ds2020.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;
import ro.tuc.ds2020.dto.MeasurementDTO;
import ro.tuc.ds2020.service.MeasurementService;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
public class MeasurementChartController {
    private final MeasurementService measurementService;
    private final ObjectMapper objectMapper;

    public MeasurementChartController(MeasurementService measurementService, ObjectMapper objectMapper) {
        this.measurementService = measurementService;
        this.objectMapper = objectMapper;
    }

    @MessageMapping("/sendMeasurement")
    @SendTo("/topic/measurements")
    public List<MeasurementDTO> handleMeasurement(@Payload String jsonMessage) {
        try {
            Map<String, Object> data = objectMapper.readValue(jsonMessage, Map.class);
            String deviceUuid = (String) data.get("deviceUuid");
            String dateString = (String) data.get("date");

            if (deviceUuid == null || dateString == null) {
                throw new IllegalArgumentException("Invalid payload: missing required fields");
            }

            UUID uuid = UUID.fromString(deviceUuid);
            LocalDate localDate = LocalDate.parse(dateString, DateTimeFormatter.ofPattern("yyyy-MM-dd"));

            return measurementService.getAllMeasurementsForDeviceByDay(uuid, localDate);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}