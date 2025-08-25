package br.com.jonasluis.backend_api.domain.user.service;

import br.com.jonasluis.backend_api.domain.user.dto.UserRegisterRequest;
import br.com.jonasluis.backend_api.domain.user.dto.UserRegisterResponse;
import br.com.jonasluis.backend_api.domain.user.entity.User;
import br.com.jonasluis.backend_api.domain.user.entity.enums.UserRole;
import br.com.jonasluis.backend_api.domain.user.mapper.UserMapper;
import br.com.jonasluis.backend_api.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UserRegisterUseCase {


    private final PasswordEncoder passwordEncoder;


    private final UserRepository userRepository;

    public UserRegisterUseCase(PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    public User execute(UserRegisterRequest dto){

        if (userRepository.existsByUsername(dto.username())) {
            throw new IllegalArgumentException("Username já cadastrado");
        }
        if (!UserRole.isValid(dto.role())) {
            throw new IllegalArgumentException("Role inválida");
        }
        var user = UserMapper.toEntity(dto, passwordEncoder);
        return userRepository.save(user);
    }

    public UserRegisterResponse executeAndReturnDTO(UserRegisterRequest dto) {
        User user = execute(dto);
        return UserMapper.toRegisterResponse(user);
    }

}
