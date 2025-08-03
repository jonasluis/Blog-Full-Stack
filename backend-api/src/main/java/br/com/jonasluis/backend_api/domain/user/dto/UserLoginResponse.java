package br.com.jonasluis.backend_api.domain.user.dto;

import java.time.Instant;

public record UserLoginResponse(
        Long id,
        String username,
        String token,
        String refreshToken,
        Instant expiresAt
        ){
}
