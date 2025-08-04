package br.com.jonasluis.backend_api.domain.post.dto;

import java.time.Instant;
import java.util.List;

public record PostGetByIdResponse(
        String title,
        String author,
        Instant createdAt,
        Instant updatedAt,
        String content,
        String coverImageUrl,
        List<String> tags
) {
}
