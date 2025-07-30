package br.com.jonasluis.backend_api.domain.user.dto;

public record UserLoginResponse(
        Long id,
        String username,
        String token
        ){
}
