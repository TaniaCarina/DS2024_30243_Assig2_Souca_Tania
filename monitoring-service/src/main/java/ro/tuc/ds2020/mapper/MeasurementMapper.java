package ro.tuc.ds2020.mapper;


import net.minidev.json.JSONObject;
import org.springframework.stereotype.Component;
import ro.tuc.ds2020.dto.MeasurementDTO;
import ro.tuc.ds2020.entity.Measurement;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Component
public class MeasurementMapper {
    public Measurement toMeasurement(String message) {
        Measurement measurement = new Measurement();
        String trimmedJson = message.replaceAll("[{}\"]", "");

        String[] keyValuePairs = trimmedJson.split(",");
        for (String pair : keyValuePairs) {
            String[] entry = pair.split(":", 2); // Split into key and value
            if (entry.length == 2) {
                String key = entry[0].trim();
                String value = entry[1].trim();

                if (key.equals("timestamp")) {
                    // Parse timestamp
                    measurement.timestamp = LocalDateTime.parse(value, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SS"));
                } else if (key.equals("device_id")) {
                    // Parse device ID
                    measurement.deviceUuid = UUID.fromString(value);
                } else if (key.equals("measurement_value")) {
                    // Parse measurement value
                    measurement.value = Double.parseDouble(value);
                }
            }
        }

        return measurement;
    }

    public MeasurementDTO toDTO(Measurement measurement) {
        MeasurementDTO dto = new MeasurementDTO();
        dto.uuid = measurement.uuid;
        dto.deviceUuid = measurement.deviceUuid;
        dto.timestamp = measurement.timestamp;
        dto.value = measurement.value;
        return dto;
    }
}
