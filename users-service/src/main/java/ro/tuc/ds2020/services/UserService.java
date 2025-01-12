package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.tuc.ds2020.dtos.UserDTO;
import ro.tuc.ds2020.dtos.UserDetailsDTO;
import ro.tuc.ds2020.dtos.builders.UserBuilder;
import ro.tuc.ds2020.entities.User;
import ro.tuc.ds2020.repositories.UserRepository;
import org.springframework.validation.BindingResult;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepo;
    private final PasswordEncoder passwordHasher;

    @Autowired
    public UserService(UserRepository userRepo, PasswordEncoder passwordHasher) {
        this.userRepo = userRepo;
        this.passwordHasher = passwordHasher;
    }

    public List<UserDTO> findUsers() {
        return userRepo.findAll().stream()
                .map(UserBuilder::toUserDTO)
                .collect(Collectors.toList());
    }

    public UserDTO findUserById(UUID userId) {
        return userRepo.findById(userId)
                .map(UserBuilder::toUserDTO)
                .orElseThrow(() -> {
                    logger.error("User with ID {} not found", userId);
                    return new IllegalArgumentException("No user found with ID: " + userId);
                });
    }

    public UUID insert(UserDetailsDTO userDetails, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            logger.warn("Validation failed for user details: {}", validationResult.getAllErrors());
            return UUID.fromString("11111111-1111-1111-1111-111111111111");
        }

        if (userRepo.existsByName(userDetails.getName())) {
            logger.warn("Username {} is already taken", userDetails.getName());
            return UUID.fromString("00000000-0000-0000-0000-000000000000");
        }

        if (!isRoleValid(userDetails.getRole())) {
            logger.warn("Invalid role: {}", userDetails.getRole());
            return UUID.fromString("22222222-2222-2222-2222-222222222222");
        }

        User newUser = UserBuilder.toEntity(userDetails);
        User savedUser = userRepo.save(newUser);
        logger.info("New user created with ID {}", savedUser.getId());
        return savedUser.getId();
    }

    private boolean isRoleValid(String role) {
        return "client".equalsIgnoreCase(role) || "admin".equalsIgnoreCase(role);
    }

    @Transactional
    public UUID update(UUID userId, UserDetailsDTO updatedDetails) {
        User existingUser = userRepo.findById(userId).orElseThrow(() -> {
            logger.error("No user found with ID {}", userId);
            return new IllegalArgumentException("User not found with ID: " + userId);
        });

        existingUser.setName(updatedDetails.getName());
        existingUser.setPassword(passwordHasher.encode(updatedDetails.getPassword()));
        existingUser.setRole(updatedDetails.getRole());
        userRepo.save(existingUser);
        logger.info("User with ID {} updated successfully", userId);

        return existingUser.getId();
    }

    public void delete(UUID userId) {
        if (userRepo.existsById(userId)) {
            userRepo.deleteById(userId);
            logger.info("User with ID {} removed from the system", userId);
        } else {
            logger.error("Attempted to delete non-existing user with ID {}", userId);
            throw new IllegalArgumentException("Cannot delete. User not found with ID: " + userId);
        }
    }

    public Optional<UserDTO> authenticate (UserDetailsDTO loginDetails) {
        return Optional.ofNullable(userRepo.findByName(loginDetails.getName()))
                .filter(user -> passwordHasher.matches(loginDetails.getPassword(), user.getPassword()))
                .map(UserBuilder::toUserDTO);
    }
}
