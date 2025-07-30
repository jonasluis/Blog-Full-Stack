package br.com.jonasluis.backend_api.domain.user.mapper;

import br.com.jonasluis.backend_api.domain.user.dto.UserRegisterRequest;
import br.com.jonasluis.backend_api.domain.user.dto.UserRegisterResponse;
import br.com.jonasluis.backend_api.domain.user.entity.User;
import br.com.jonasluis.backend_api.domain.user.entity.enums.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class UserMapper {

    public static UserRegisterResponse toRegisterResponse(User user) {
        return new UserRegisterResponse(
                user.getId(),
                user.getUsername(),
                user.getRole()
        );
    }

    public static User toEntity(UserRegisterRequest dto, PasswordEncoder passwordEncoder) {
        User user = new User();
        user.setUsername(dto.username());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole(UserRole.valueOf(dto.role().toUpperCase()));
        return user;
    }
}
