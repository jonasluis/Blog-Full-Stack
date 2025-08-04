package br.com.jonasluis.backend_api.controller;


import br.com.jonasluis.backend_api.domain.post.dto.*;
import br.com.jonasluis.backend_api.domain.post.service.GetAllPostsUseCase;
import br.com.jonasluis.backend_api.domain.post.service.GetPostByIdUseCase;
import br.com.jonasluis.backend_api.domain.post.service.PostCreateUseCase;
import br.com.jonasluis.backend_api.domain.post.service.UpdatePostUseCase;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {
    @Autowired
    private PostCreateUseCase postCreate;

    @Autowired
    private GetAllPostsUseCase getAllPosts;

    @Autowired
    private GetPostByIdUseCase getPostById;

    @Autowired
    private UpdatePostUseCase updatePost;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PostResponseDTO> create(@RequestBody @Valid PostCreateRequest request){
        var post =  postCreate.executeAndReturnDTO(request);

        URI location = URI.create("/posts/" + post.id());
        return ResponseEntity.created(location).body(post);
    }

    @GetMapping
    public ResponseEntity<List<PostGetAllResponse>> getAllPosts() {
        List<PostGetAllResponse> response = getAllPosts.execute();
        return ResponseEntity.ok(response);
    }
    @GetMapping("/{id}")
    public ResponseEntity<PostGetByIdResponse> getPostById(@PathVariable Long id) {
        PostGetByIdResponse response = getPostById.execute(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updatePost(@PathVariable Long id, @RequestBody PostUpdateRequest request) {
        updatePost.execute(id, request);
        return ResponseEntity.noContent().build();
    }


}
