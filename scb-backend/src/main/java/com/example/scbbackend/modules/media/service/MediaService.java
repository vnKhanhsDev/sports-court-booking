package com.example.scbbackend.modules.media.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.scbbackend.modules.media.entity.Media;
import com.example.scbbackend.modules.media.repository.MediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final Cloudinary cloudinary;
    private final MediaRepository mediaRepository;

    public Media uploadMedia(MultipartFile file, String folderName) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }

        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("folder", folderName, "resource_type", "auto")
            );

            String secureUrl = (String) uploadResult.get("secure_url");
            
            Media media = Media.builder()
                    .url(secureUrl)
                    .isTemp(true)
                    .build();
            
            return mediaRepository.save(media);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload media", e);
        }
    }

}
