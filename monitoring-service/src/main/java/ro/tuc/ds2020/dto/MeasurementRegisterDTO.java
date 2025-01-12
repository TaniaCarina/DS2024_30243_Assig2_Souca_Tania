package ro.tuc.ds2020.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class MeasurementRegisterDTO {
    public LocalDateTime timestamp;
    public UUID deviceUuid;
    public Double value;
}
