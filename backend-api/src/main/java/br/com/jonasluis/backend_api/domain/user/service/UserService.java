package br.com.jonasluis.backend_api.domain.user.service;

import br.com.jonasluis.backend_api.domain.user.repository.UserRepository;

import br.com.jonasluis.backend_api.domain.user.dto.UserResponse;
import br.com.jonasluis.backend_api.domain.user.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    @Autowired  
    private UserRepository userRepository;

        public List<UserResponse> getAllUsers() {
            var users = userRepository.findAll();
            return users.stream()
                    .map(UserMapper::toUserResponse)
                    .toList();
        }
}