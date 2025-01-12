package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.UsersIdsDTO;
import ro.tuc.ds2020.dtos.UsersIdsDetailsDTO;
import ro.tuc.ds2020.entities.UsersIds;

public class UsersIdsBuilder {
    private UsersIdsBuilder(){

    }
    public static UsersIds toEntity(UsersIdsDetailsDTO usersIdsDetailsDTO) {
        return new UsersIds(usersIdsDetailsDTO.getUserId(), usersIdsDetailsDTO.getUsername());

    }
}
