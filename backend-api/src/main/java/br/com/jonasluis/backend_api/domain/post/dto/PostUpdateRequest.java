package br.com.jonasluis.backend_api.domain.post.dto;

import java.time.Instant;
import java.util.List;

public record PostUpdateRequest(
        String title,
        String author,
        String summary,
        String content,
        String coverImageUrl,
        List<String> tags
) {
}
