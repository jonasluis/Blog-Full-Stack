package br.com.jonasluis.backend_api.domain.user.dto;

import java.time.Instant;

public record TokenRefreshResponse(
        String token,
        String refreshToken,
        Instant expiresAt
) {
}