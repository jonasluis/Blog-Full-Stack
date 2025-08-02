package br.com.jonasluis.backend_api.domain.post.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PostCreateRequest(
        @NotBlank(message = "Título é obrigatório")
        @Size(max = 255)
        String title,

        @NotBlank(message = "Autor é obrigatório")
        String author,
        String summary,
        @NotBlank(message = "Conteúdo é obrigatório")
        String content,
        String coverImageUrl,
        List<String> tags
) {
}
