package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.dtos.DeviceDetailsDTO;
import ro.tuc.ds2020.dtos.UsersIdsDetailsDTO;
import ro.tuc.ds2020.services.DeviceService;
import ro.tuc.ds2020.services.UsersIdsService;

import javax.validation.Valid;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping(value = "/devices")
public class DeviceController {

    private final DeviceService deviceService;
    private final UsersIdsService usersIdsService;

    @Autowired
    public DeviceController(DeviceService deviceService, UsersIdsService usersIdsService) {
        this.deviceService = deviceService;
        this.usersIdsService = usersIdsService;
    }

    @GetMapping
    public ResponseEntity<List<DeviceDTO>> retrieveAllDevices() {
        Collection<? extends GrantedAuthority> userRoles = SecurityContextHolder.getContext().getAuthentication().getAuthorities();
        boolean isAdmin = userRoles.stream().anyMatch(role -> role.getAuthority().equals("ADMIN"));
        List<DeviceDTO> devices;

        if (isAdmin) {
            devices = deviceService.getAllDevices();
        } else {
            String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
            devices = deviceService.getDevicesByUsername(currentUser);
        }

        devices.forEach(device -> {
            Link detailsLink = linkTo(methodOn(DeviceController.class).retrieveDevice(device.getId())).withRel("deviceDetails");
            device.add(detailsLink);
        });

        return ResponseEntity.ok(devices);
    }

    @PostMapping
    public ResponseEntity<UUID> createDevice(@Valid @RequestBody DeviceDetailsDTO deviceDetails) {
        UUID deviceId = deviceService.addDevice(deviceDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(deviceId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeviceDetailsDTO> retrieveDevice(@PathVariable("id") UUID deviceId) {
        DeviceDetailsDTO deviceDetails = deviceService.getDeviceById(deviceId);
        return ResponseEntity.ok(deviceDetails);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UUID> modifyDevice(@PathVariable("id") UUID deviceId, @Valid @RequestBody DeviceDetailsDTO updatedDetails) {
        UUID updatedDeviceId = deviceService.updateDevice(deviceId, updatedDetails);
        return ResponseEntity.ok(updatedDeviceId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeDevice(@PathVariable("id") UUID deviceId) {
        deviceService.removeDevice(deviceId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/userIds")
    public ResponseEntity<UUID> addUserId(@Valid @RequestBody UsersIdsDetailsDTO userIdsDetails) {
        UUID userId = usersIdsService.insertUserId(userIdsDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(userId);
    }

    @DeleteMapping("/userIds/{userId}")
    public ResponseEntity<Void> deleteUserId(@PathVariable("userId") UUID userId) {
        usersIdsService.deleteUserId(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DeviceDTO>> retrieveDevicesByUser(@PathVariable("userId") UUID userId) {
        List<DeviceDTO> devices = deviceService.getDevicesByUserId(userId);
        devices.forEach(device -> {
            Link detailsLink = linkTo(methodOn(DeviceController.class).retrieveDevice(device.getId())).withRel("deviceDetails");
            device.add(detailsLink);
        });
        return ResponseEntity.ok(devices);
    }
}
