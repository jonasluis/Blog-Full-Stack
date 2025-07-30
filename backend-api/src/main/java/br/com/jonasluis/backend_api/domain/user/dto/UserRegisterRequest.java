package br.com.jonasluis.backend_api.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserRegisterRequest(
        @NotBlank
        String username,
        @NotBlank
        String password,

        @NotNull
        String role

){
}
