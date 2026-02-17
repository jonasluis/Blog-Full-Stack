package br.com.jonasluis.backend_api.controller;

import br.com.jonasluis.backend_api.domain.user.dto.TokenRefreshRequest;
import br.com.jonasluis.backend_api.domain.user.dto.TokenRefreshResponse;
import br.com.jonasluis.backend_api.domain.user.dto.UserLoginRequest;
import br.com.jonasluis.backend_api.domain.user.dto.UserLoginResponse;
import br.com.jonasluis.backend_api.domain.user.dto.UserRegisterRequest;
import br.com.jonasluis.backend_api.domain.user.dto.UserRegisterResponse;
import br.com.jonasluis.backend_api.domain.user.service.TokenRefreshUseCase;
import br.com.jonasluis.backend_api.domain.user.service.UserLoginUseCase;
import br.com.jonasluis.backend_api.domain.user.service.UserRegisterUseCase;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.com.jonasluis.backend_api.domain.user.dto.UserResponse;
import br.com.jonasluis.backend_api.domain.user.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

import java.net.URI;


@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRegisterUseCase userRegister;
    @Autowired
    private UserLoginUseCase userLogin;
    @Autowired
    private TokenRefreshUseCase tokenRefresh;
    @Autowired
    private UserService userService;

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
    
    @PostMapping("/refresh-token")
    public ResponseEntity<TokenRefreshResponse> refreshToken(@RequestBody @Valid TokenRefreshRequest request) {
        var response = tokenRefresh.execute(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping()
    public ResponseEntity<List<UserResponse>> getUsers(){
        var users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

}
