package ro.tuc.ds2020.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "device")
public class Device {
    @Id
    public UUID uuid;
    public UUID userUuid;
    public Float maxHourlyConsumption;

    public UUID getUuid() {
        return uuid;
    }

    public UUID getUserUuid() {
        return userUuid;
    }

    public Float getMaxHourlyConsumption() {
        return maxHourlyConsumption;
    }
}
