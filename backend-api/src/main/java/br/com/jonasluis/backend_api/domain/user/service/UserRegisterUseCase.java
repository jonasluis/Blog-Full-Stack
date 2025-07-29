package br.com.jonasluis.backend_api.domain.user.service;

import br.com.jonasluis.backend_api.domain.user.dto.UserRegisterRequest;
import br.com.jonasluis.backend_api.domain.user.dto.UserRegisterResponse;
import br.com.jonasluis.backend_api.domain.user.entity.User;
import br.com.jonasluis.backend_api.domain.user.entity.enums.UserRole;
import br.com.jonasluis.backend_api.domain.user.mapper.UserMapper;
import br.com.jonasluis.backend_api.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UserRegisterUseCase {
    @Autowired
    private UserRepository userRepository;

    public User execute(UserRegisterRequest dto){

        if (userRepository.existsByUsername(dto.username())) {
            throw new IllegalArgumentException("Username já cadastrado");
        }
        if (!UserRole.isValid(dto.role())) {
            throw new IllegalArgumentException("Role inválida");
        }

        User user = new User();
        user.setUsername(dto.username());
        user.setPassword(dto.password());
        user.setRole(UserRole.valueOf(dto.role().toUpperCase()));

        return userRepository.save(user);
    }

    public UserRegisterResponse executeAndReturnDTO(UserRegisterRequest dto) {
        User user = execute(dto);
        return UserMapper.toRegisterResponse(user);
    }

}
