package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.dtos.UsersIdsDetailsDTO;
import ro.tuc.ds2020.dtos.builders.UsersIdsBuilder;
import ro.tuc.ds2020.entities.UsersIds;
import ro.tuc.ds2020.repositories.UsersIdsRepository;

import java.util.Optional;
import java.util.UUID;

@Service
public class UsersIdsService {

    private static final Logger logger = LoggerFactory.getLogger(UsersIdsService.class);
    private final UsersIdsRepository usersIdsRepository;

    @Autowired
    public UsersIdsService(UsersIdsRepository usersIdsRepository) {
        this.usersIdsRepository = usersIdsRepository;
    }

    public UUID insertUserId(UsersIdsDetailsDTO usersIdsDTO) {
        UsersIds userEntity = UsersIdsBuilder.toEntity(usersIdsDTO);
        userEntity = usersIdsRepository.save(userEntity);
        logger.info("User {} with unique ID {} has been added to the database.", userEntity.getUsername(), userEntity.getUserId());
        return userEntity.getUserId();
    }

    public void deleteUserId(UUID userId) {
        Optional<UsersIds> userOptional = usersIdsRepository.findByUserId(userId);
        if (userOptional.isPresent()) {
            usersIdsRepository.delete(userOptional.get());
            logger.info("User with unique ID {} has been successfully removed.", userId);
        } else {
            logger.warn("User with ID {} was not found in the database. Deletion failed.", userId);
            throw new IllegalArgumentException("No user found with ID: " + userId);
        }
    }
}
