package br.com.jonasluis.backend_api.domain.user.mapper;

import br.com.jonasluis.backend_api.domain.user.dto.UserRegisterResponse;
import br.com.jonasluis.backend_api.domain.user.entity.User;

public class UserMapper {
    public static UserRegisterResponse toRegisterResponse(User user) {
        return new UserRegisterResponse(
                user.getId(),
                user.getUsername(),
                user.getRole()
        );
    }
}
