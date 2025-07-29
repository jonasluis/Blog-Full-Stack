package br.com.jonasluis.backend_api.domain.user.entity.enums;

public enum UserRole {
    ADMIN,
    CLIENTE;

    public static boolean isValid(String role) {
        try {
            UserRole.valueOf(role.toUpperCase());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

}
