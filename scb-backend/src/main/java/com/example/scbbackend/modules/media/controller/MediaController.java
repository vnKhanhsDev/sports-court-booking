package com.example.scbbackend.modules.media.controller;

import com.example.scbbackend.common.response.ApiResponse;
import com.example.scbbackend.modules.media.dto.response.MediaUploadResponse;
import com.example.scbbackend.modules.media.entity.Media;
import com.example.scbbackend.modules.media.service.MediaService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ApiResponse<MediaUploadResponse> uploadMedia(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", required = false, defaultValue = "media") String folderName,
            HttpServletRequest httpRequest
    ) {
        Media media = mediaService.uploadMedia(file, folderName);
        
        MediaUploadResponse response = MediaUploadResponse.builder()
                .url(media.getUrl())
                .build();
        
        return ApiResponse.success(response, httpRequest);
    }

}
