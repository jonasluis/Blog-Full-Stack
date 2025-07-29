package br.com.jonasluis.backend_api.domain.user.repository;

import br.com.jonasluis.backend_api.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);
}
