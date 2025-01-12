package ro.tuc.ds2020.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "measurement")
public class Measurement {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public UUID uuid;
    public UUID deviceUuid;
    public Double value;
    public LocalDateTime timestamp;

    public UUID getUuid() {
        return uuid;
    }

    public UUID getDeviceUuid() {
        return deviceUuid;
    }

    public Double getValue() {
        return value;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
