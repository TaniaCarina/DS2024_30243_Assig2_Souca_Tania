package ro.tuc.ds2020.service;

import org.springframework.stereotype.Service;
import ro.tuc.ds2020.dto.MeasurementDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public interface MeasurementService {

    MeasurementDTO registerMeasurement(String message);

    List<MeasurementDTO> getAllMeasurementsForDeviceByDay(UUID uuid, LocalDate date);
}
