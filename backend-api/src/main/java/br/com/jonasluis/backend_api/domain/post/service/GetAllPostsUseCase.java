package br.com.jonasluis.backend_api.domain.post.service;

import br.com.jonasluis.backend_api.domain.post.dto.PostGetAllResponse;
import br.com.jonasluis.backend_api.domain.post.entity.Post;
import br.com.jonasluis.backend_api.domain.post.mapper.PostMapper;
import br.com.jonasluis.backend_api.domain.post.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetAllPostsUseCase {

    @Autowired
    private PostRepository postRepository;

    public List<PostGetAllResponse> execute() {
        List<Post> posts = postRepository.findAll();

        return posts.stream()
                .map(PostMapper::toGetAllResponse)
                .toList();
    }
}
