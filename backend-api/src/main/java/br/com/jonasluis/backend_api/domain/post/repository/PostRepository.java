package br.com.jonasluis.backend_api.domain.post.repository;

import br.com.jonasluis.backend_api.domain.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
