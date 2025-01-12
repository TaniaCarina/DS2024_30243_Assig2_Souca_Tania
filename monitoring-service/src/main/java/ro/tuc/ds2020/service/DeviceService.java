package ro.tuc.ds2020.service;


import ro.tuc.ds2020.dto.DeviceDTO;

import java.util.List;
import java.util.UUID;

public interface DeviceService {

    DeviceDTO registerDevice(String message);

    DeviceDTO updateDevice(String message);

    void deleteDevice(String message);

    List<DeviceDTO> getAllDevicesForUser(UUID uuid);
}
