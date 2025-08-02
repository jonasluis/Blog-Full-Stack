package br.com.jonasluis.backend_api.domain.user.mapper;

import br.com.jonasluis.backend_api.domain.user.dto.TokenRefreshResponse;
import br.com.jonasluis.backend_api.domain.user.dto.UserLoginResponse;
import br.com.jonasluis.backend_api.domain.user.dto.UserRegisterRequest;
import br.com.jonasluis.backend_api.domain.user.dto.UserRegisterResponse;
import br.com.jonasluis.backend_api.domain.user.entity.User;
import br.com.jonasluis.backend_api.domain.user.entity.enums.UserRole;
import lombok.experimental.UtilityClass;

import org.springframework.security.crypto.password.PasswordEncoder;

@UtilityClass
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

    public static UserLoginResponse toLoginResponse(User user, String token, String refreshToken, java.time.Instant expiresAt) {
        return new UserLoginResponse(
                user.getId(),
                user.getUsername(),
                token,
                refreshToken,
                expiresAt
        );
    }
    
    public static TokenRefreshResponse toTokenRefreshResponse(String token, String refreshToken, java.time.Instant expiresAt) {
        return new TokenRefreshResponse(
                token,
                refreshToken,
                expiresAt
        );
    }
}
