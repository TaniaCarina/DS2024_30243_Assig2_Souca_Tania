package ro.tuc.ds2020.service.impl;


import org.springframework.stereotype.Service;
import ro.tuc.ds2020.dto.MeasurementDTO;
import ro.tuc.ds2020.entity.Measurement;
import ro.tuc.ds2020.mapper.MeasurementMapper;
import ro.tuc.ds2020.repository.MeasurementRepository;
import ro.tuc.ds2020.service.MeasurementService;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.thymeleaf.util.StringUtils.length;

@Service
public class MeasurementServiceImpl implements MeasurementService {
    private final MeasurementRepository measurementRepository;
    private final MeasurementMapper measurementMapper;

    public MeasurementServiceImpl(MeasurementRepository measurementRepository, MeasurementMapper measurementMapper) {
        this.measurementRepository = measurementRepository;
        this.measurementMapper = measurementMapper;
    }

    @Override
    public MeasurementDTO registerMeasurement(String message) {
        Measurement savedMeasurement = this.measurementRepository.save(measurementMapper.toMeasurement(message));
        return measurementMapper.toDTO(savedMeasurement);
    }

    @Override
    public List<MeasurementDTO> getAllMeasurementsForDeviceByDay(UUID uuid, LocalDate date) {
        System.out.println("SUNT AICI++++++++++++++++++");
        List<Measurement> measurements = measurementRepository.findByDeviceUuidAndTimestampBetween(uuid, date.atTime(0, 0, 0), date.atTime(23,59,59));
        System.out.println(length(measurements));
        return measurements.stream().map(measurementMapper::toDTO).collect(java.util.stream.Collectors.toList());
    }

}
