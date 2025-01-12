package ro.tuc.ds2020.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.tuc.ds2020.entity.Device;

import java.util.List;
import java.util.UUID;

public interface DeviceRepository extends JpaRepository<Device, UUID> {
    List<Device> findAllByUserUuid(UUID uuid);
}
