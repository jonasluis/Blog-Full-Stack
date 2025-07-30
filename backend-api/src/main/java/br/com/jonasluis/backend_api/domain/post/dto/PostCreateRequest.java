package br.com.jonasluis.backend_api.domain.post.dto;

import jakarta.persistence.ElementCollection;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.util.List;

public record PostCreateRequest(
        String title,
        String author,
        String summary,
        String content,
        String coverImageUrl,
        List<String> tags
) {
}
