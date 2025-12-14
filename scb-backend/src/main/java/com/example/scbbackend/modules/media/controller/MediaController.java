package com.example.scbbackend.modules.media.controller;

import com.example.scbbackend.common.dto.ApiResponse;
import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.modules.media.dto.response.MediaUploadResponse;
import com.example.scbbackend.modules.media.entity.Media;
import com.example.scbbackend.modules.media.service.MediaService;
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
            @RequestParam(value = "folder", required = false, defaultValue = "media") String folderName
    ) {
        Media media = mediaService.uploadMedia(file, folderName);
        
        MediaUploadResponse response = MediaUploadResponse.builder()
                .url(media.getUrl())
                .build();
        
        return ApiResponse.success(ApiCode.UPLOAD_MEDIA_SUCCESS, response);
    }

}
