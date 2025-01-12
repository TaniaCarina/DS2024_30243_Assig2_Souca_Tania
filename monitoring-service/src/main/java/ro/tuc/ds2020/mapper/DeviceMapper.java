package ro.tuc.ds2020.mapper;

import org.springframework.stereotype.Component;
import ro.tuc.ds2020.dto.DeviceDTO;
import ro.tuc.ds2020.entity.Device;

import java.util.UUID;

@Component
public class DeviceMapper {
    public DeviceDTO toDTO(String uuid, String userUuid, String maxHourlyConsumption) {
        DeviceDTO deviceDTO = new DeviceDTO();
        deviceDTO.uuid = UUID.fromString(uuid);
        deviceDTO.userUuid = UUID.fromString(userUuid);
        deviceDTO.maxHourlyConsumption = Float.parseFloat(maxHourlyConsumption);
        return deviceDTO;
    }

    public Device toDevice(DeviceDTO deviceDTO) {
        Device device = new Device();
        device.uuid = deviceDTO.uuid;
        device.userUuid = deviceDTO.userUuid;
        device.maxHourlyConsumption = deviceDTO.maxHourlyConsumption;
        return device;
    }

    public DeviceDTO toDTO(Device savedDevice) {
        DeviceDTO deviceDTO = new DeviceDTO();
        deviceDTO.uuid = savedDevice.uuid;
        deviceDTO.userUuid = savedDevice.userUuid;
        deviceDTO.maxHourlyConsumption = savedDevice.maxHourlyConsumption;
        return deviceDTO;
    }
}
