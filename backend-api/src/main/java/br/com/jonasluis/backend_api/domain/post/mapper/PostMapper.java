package br.com.jonasluis.backend_api.domain.post.mapper;

import br.com.jonasluis.backend_api.domain.post.dto.PostCreateRequest;
import br.com.jonasluis.backend_api.domain.post.dto.PostResponseDTO;
import br.com.jonasluis.backend_api.domain.post.entity.Post;

public class PostMapper {

    public static Post toEntity(PostCreateRequest dto) {
        Post post = new Post();
        post.setTitle(dto.title());
        post.setAuthor(dto.author());
        post.setSummary(dto.summary());
        post.setContent(dto.content());
        post.setCoverImageUrl(dto.coverImageUrl());
        post.setTags(dto.tags());
        return post;
    }

    public static PostResponseDTO toResponse(Post post) {
        return new PostResponseDTO(
                post.getId(),
                post.getTitle(),
                post.getAuthor(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                post.getSummary(),
                post.getContent(),
                post.getCoverImageUrl(),
                post.getTags()
        );
    }
}
