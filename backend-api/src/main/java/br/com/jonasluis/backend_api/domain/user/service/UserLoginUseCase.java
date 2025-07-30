package br.com.jonasluis.backend_api.domain.user.service;

import br.com.jonasluis.backend_api.domain.user.dto.UserLoginRequest;
import br.com.jonasluis.backend_api.domain.user.dto.UserLoginResponse;
import br.com.jonasluis.backend_api.domain.user.entity.User;
import br.com.jonasluis.backend_api.domain.user.mapper.UserMapper;
import br.com.jonasluis.backend_api.domain.user.repository.UserRepository;
import br.com.jonasluis.backend_api.infra.security.TokenService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UserLoginUseCase {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    public User execute(UserLoginRequest dto){
        var user = userRepository.findByUsername(dto.username())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + dto.username()));;
        if (!passwordEncoder.matches(dto.password(), user.getPassword())) {
            throw new IllegalArgumentException("Senha inválida");
        }
       return user;
    }



    public UserLoginResponse executeAndReturnDTO(UserLoginRequest dto) {
        User user = execute(dto);
        String token = tokenService.generateToken(user);

        return UserMapper.toLoginResponse(user, token);
    }
}
