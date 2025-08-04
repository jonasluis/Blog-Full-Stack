package br.com.jonasluis.backend_api.domain.post.mapper;

import br.com.jonasluis.backend_api.domain.post.dto.*;
import br.com.jonasluis.backend_api.domain.post.entity.Post;

import java.time.Instant;

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

    public static PostGetAllResponse toGetAllResponse(Post post) {
        return new PostGetAllResponse(
                post.getId(),
                post.getTitle(),
                post.getAuthor(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                post.getSummary(),
                post.getTags()
        );
    }

    public static PostGetByIdResponse toGetByIdResponse(Post post) {
        return new PostGetByIdResponse(
                post.getTitle(),
                post.getAuthor(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                post.getContent(),
                post.getCoverImageUrl(),
                post.getTags()
        );
    }

    public static void updateEntity(Post post, PostUpdateRequest dto) {
        post.setTitle(dto.title());
        post.setAuthor(dto.author());
        post.setSummary(dto.summary());
        post.setContent(dto.content());
        post.setCoverImageUrl(dto.coverImageUrl());
        post.setTags(dto.tags());
        post.setUpdatedAt(Instant.now());
    }

}
