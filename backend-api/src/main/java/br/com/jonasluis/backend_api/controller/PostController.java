package br.com.jonasluis.backend_api.controller;


import br.com.jonasluis.backend_api.domain.post.dto.PostCreateRequest;
import br.com.jonasluis.backend_api.domain.post.dto.PostResponseDTO;
import br.com.jonasluis.backend_api.domain.post.service.PostCreateUseCase;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/posts")
public class PostController {

    private final PostCreateUseCase postCreate;

    public PostController(PostCreateUseCase postCreate) {
        this.postCreate = postCreate;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PostResponseDTO> create(@RequestBody @Valid PostCreateRequest request){
        var post =  postCreate.executeAndReturnDTO(request);

        URI location = URI.create("/posts/" + post.id());
        return ResponseEntity.created(location).body(post);
    }


}
