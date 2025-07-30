package br.com.jonasluis.backend_api.domain.post.service;

import br.com.jonasluis.backend_api.domain.post.dto.PostCreateRequest;
import br.com.jonasluis.backend_api.domain.post.dto.PostResponseDTO;
import br.com.jonasluis.backend_api.domain.post.entity.Post;
import br.com.jonasluis.backend_api.domain.post.mapper.PostMapper;
import br.com.jonasluis.backend_api.domain.post.repository.PostRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class PostCreateUseCase {
    @Autowired
    private PostRepository postRepository;

    public Post execute(PostCreateRequest request){
        var post = PostMapper.toEntity(request);
        return postRepository.save(post);
    }

    public PostResponseDTO executeAndReturnDTO(PostCreateRequest request){
        Post post = execute(request);

        return PostMapper.toResponse(post);
    }

}
