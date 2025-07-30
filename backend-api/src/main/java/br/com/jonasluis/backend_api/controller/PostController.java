package br.com.jonasluis.backend_api.controller;


import br.com.jonasluis.backend_api.domain.post.dto.PostCreateRequest;
import br.com.jonasluis.backend_api.domain.post.dto.PostResponseDTO;
import br.com.jonasluis.backend_api.domain.post.service.PostCreateUseCase;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("/posts")
public class PostController {
    @Autowired
    private PostCreateUseCase postCreate;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PostResponseDTO> create(@RequestBody @Valid PostCreateRequest request){
        var post =  postCreate.executeAndReturnDTO(request);

        URI location = URI.create("/posts/" + post.id());
        return ResponseEntity.created(location).body(post);
    }
}
