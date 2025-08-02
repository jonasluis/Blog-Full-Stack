package br.com.jonasluis.backend_api.domain.user.service;

import br.com.jonasluis.backend_api.domain.user.dto.TokenRefreshRequest;
import br.com.jonasluis.backend_api.domain.user.dto.TokenRefreshResponse;
import br.com.jonasluis.backend_api.domain.user.entity.User;
import br.com.jonasluis.backend_api.domain.user.mapper.UserMapper;
import br.com.jonasluis.backend_api.domain.user.repository.UserRepository;
import br.com.jonasluis.backend_api.infra.security.TokenService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
@Transactional
public class TokenRefreshUseCase {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserRepository userRepository;

    public TokenRefreshResponse execute(TokenRefreshRequest request) {

        String username = tokenService.verifyRefreshToken(request.refreshToken());
        if (username == null) {
            throw new IllegalArgumentException("Refresh token inválido ou expirado");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));

        String newAccessToken = tokenService.generateToken(user);
        
        String newRefreshToken = tokenService.generateRefreshToken(user);
        
        ZoneId zoneId = ZoneId.of("America/Sao_Paulo");
        Instant expiresAt = LocalDateTime.now()
            .plusSeconds(tokenService.getAccessTokenExpirationSeconds())
            .atZone(zoneId)
            .toInstant();

        return UserMapper.toTokenRefreshResponse(newAccessToken, newRefreshToken, expiresAt);
    }
}