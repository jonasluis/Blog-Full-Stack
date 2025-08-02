package br.com.jonasluis.backend_api.infra.security;

import br.com.jonasluis.backend_api.domain.user.entity.User;
import br.com.jonasluis.backend_api.infra.security.enums.TokenType;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;
    
    @Value("${api.security.token.refresh.secret:${api.security.token.secret}refresh}")
    private String refreshSecret;
    
    @Value("${api.security.token.expiration:7200}")
    private Long accessTokenExpirationSeconds;
    
    @Value("${api.security.token.refresh.expiration:604800}")
    private Long refreshTokenExpirationSeconds;

    public String generateToken(User user) {
        try {
            var algorithm = Algorithm.HMAC256(secret);

            List<String> roles = user.getAuthorities()
                    .stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            return JWT.create()
                    .withIssuer("API Blog")
                    .withSubject(user.getUsername())
                    .withClaim("roles", roles)
                    .withClaim("type", TokenType.ACCESS.name().toLowerCase())
                    .withJWTId(UUID.randomUUID().toString())
                    .withIssuedAt(Instant.now())
                    .withExpiresAt(accessTokenExpirationDate())
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar token JWT", exception);
        }
    }
    
    public String generateRefreshToken(User user) {
        try {
            var algorithm = Algorithm.HMAC256(refreshSecret);

            return JWT.create()
                    .withIssuer("API Blog")
                    .withSubject(user.getUsername())
                    .withClaim("type", TokenType.REFRESH.name().toLowerCase())
                    .withJWTId(UUID.randomUUID().toString())
                    .withExpiresAt(refreshTokenExpirationDate())
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar refresh token JWT", exception);
        }
    }

    public String getSubject(String tokenJWT) {
        try {
            var algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("API Blog")
                    .build()
                    .verify(tokenJWT)
                    .getSubject();

        } catch (JWTVerificationException exception) {
            throw new RuntimeException("Token JWT inválido ou expirado!");
        }
    }
    
    public DecodedJWT verifyToken(String tokenJWT) {
        try {
            var algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("API Blog")
                    .withClaim("type", TokenType.ACCESS.name().toLowerCase())
                    .build()
                    .verify(tokenJWT);
        } catch (JWTVerificationException exception) {
            return null;
        }
    }
   
    public String verifyRefreshToken(String refreshToken) {
        try {
            var algorithm = Algorithm.HMAC256(refreshSecret);
            DecodedJWT decodedJWT = JWT.require(algorithm)
                    .withIssuer("API Blog")
                    .withClaim("type", TokenType.REFRESH.name().toLowerCase())
                    .build()
                    .verify(refreshToken);
            return decodedJWT.getSubject();
        } catch (JWTVerificationException exception) {
            return null;
        }
    }

    private Instant accessTokenExpirationDate() {
        return LocalDateTime.now()
                .plusSeconds(accessTokenExpirationSeconds)
                .atZone(ZoneId.of("America/Sao_Paulo"))
                .toInstant();
    }
    
    private Instant refreshTokenExpirationDate() {
        return LocalDateTime.now()
                .plusSeconds(refreshTokenExpirationSeconds)
                .atZone(ZoneId.of("America/Sao_Paulo"))
                .toInstant();
    }
    
    public Long getAccessTokenExpirationSeconds() {
        return accessTokenExpirationSeconds;
    }
    
    public Long getRefreshTokenExpirationSeconds() {
        return refreshTokenExpirationSeconds;
    }
}
