package br.com.jonasluis.backend_api.infra.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return  httpSecurity.csrf(csrf -> csrf.disable())
        .cors(cors -> {})
                .sessionManagement(
                        session -> session
                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests( authorize -> authorize
                    .requestMatchers(HttpMethod.POST,"/users/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/images/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/upload").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/posts").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/posts/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/posts/**").permitAll()
                    .anyRequest().authenticated())
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
