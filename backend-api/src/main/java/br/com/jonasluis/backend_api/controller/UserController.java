package br.com.jonasluis.backend_api.controller;

import br.com.jonasluis.backend_api.domain.user.dto.UserLoginRequest;
import br.com.jonasluis.backend_api.domain.user.dto.UserLoginResponse;
import br.com.jonasluis.backend_api.domain.user.dto.UserRegisterRequest;
import br.com.jonasluis.backend_api.domain.user.dto.UserRegisterResponse;
import br.com.jonasluis.backend_api.domain.user.service.UserLoginUseCase;
import br.com.jonasluis.backend_api.domain.user.service.UserRegisterUseCase;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;


@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRegisterUseCase userRegister;
    @Autowired
    private UserLoginUseCase userLogin;

    @PostMapping("/register")
    public ResponseEntity<UserRegisterResponse> register(@RequestBody @Valid UserRegisterRequest request){
            var user = userRegister.executeAndReturnDTO(request);
        URI location = URI.create("/users/" + user.id());
        return ResponseEntity.created(location).body(user);
    }

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponse> login(@RequestBody @Valid UserLoginRequest loginRequest){
        var login = userLogin.executeAndReturnDTO(loginRequest);

        return ResponseEntity.ok(login);
    }

}
