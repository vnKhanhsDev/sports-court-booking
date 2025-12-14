package com.example.scbbackend.modules.media.dto.response;

import lombok.Builder;

@Builder(toBuilder = true)
public record MediaUploadResponse(
        String url
) {
}
