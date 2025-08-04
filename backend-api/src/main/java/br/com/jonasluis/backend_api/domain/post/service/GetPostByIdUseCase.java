package br.com.jonasluis.backend_api.domain.post.service;

import br.com.jonasluis.backend_api.domain.post.dto.PostGetByIdResponse;
import br.com.jonasluis.backend_api.domain.post.entity.Post;
import br.com.jonasluis.backend_api.domain.post.mapper.PostMapper;
import br.com.jonasluis.backend_api.domain.post.repository.PostRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class GetPostByIdUseCase {

    @Autowired
    private PostRepository postRepository;

    public PostGetByIdResponse execute(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        return PostMapper.toGetByIdResponse(post);
    }
}
