package br.com.jonasluis.backend_api.domain.user.dto;

import jakarta.validation.constraints.NotBlank;

public record TokenRefreshRequest(
        @NotBlank(message = "Refresh token é obrigatório")
        String refreshToken
) {
}