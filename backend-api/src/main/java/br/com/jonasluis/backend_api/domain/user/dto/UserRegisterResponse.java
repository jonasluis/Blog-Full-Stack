package br.com.jonasluis.backend_api.domain.user.dto;

import br.com.jonasluis.backend_api.domain.user.entity.enums.UserRole;

public record UserRegisterResponse(

        Long id,
        String username,
        UserRole role

){
}
