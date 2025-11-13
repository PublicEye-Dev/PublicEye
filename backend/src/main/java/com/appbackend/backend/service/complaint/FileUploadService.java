package com.appbackend.backend.service.complaint;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileUploadService {

    private final Cloudinary cloudinary;

    @Value("${cloudinary.upload.folder:complaints}")
    private String uploadFolder;

    @Value("${cloudinary.upload.max-size-bytes:5242880}") // default 5 MB
    private long maxFileSize;

    public UploadedImage uploadImage(MultipartFile file) {
        validateFile(file);

        try {
            Map<String, Object> options = ObjectUtils.asMap(
                    "folder", uploadFolder,
                    "resource_type", "image",
                    "use_filename", true,
                    "unique_filename", true,
                    "overwrite", false,
                    "format", "jpg" // sau lasă Cloudinary să decidă; schimbă dacă dorești
            );

            Map<String, Object> result = cloudinary.uploader().upload(file.getBytes(), options);

            String secureUrl = (String) result.get("secure_url");
            String publicId = (String) result.get("public_id");

            if (secureUrl == null || publicId == null) {
                throw new IllegalStateException("Upload-ul a reușit, dar Cloudinary nu a returnat URL/public_id.");
            }

            return new UploadedImage(secureUrl, publicId);
        } catch (IOException ex) {
            log.error("Eroare Cloudinary la încărcarea fișierului: {}", ex.getMessage(), ex);
            throw new IllegalStateException("Încărcarea imaginii a eșuat. Încearcă din nou.", ex);
        }
    }

    public void deleteImage(String publicId) {
        if (publicId == null || publicId.isBlank()) {
            return;
        }

        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException ex) {
            log.warn("Nu am putut șterge imaginea cu public_id={}. Mesaj: {}", publicId, ex.getMessage());
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Fișierul este gol.");
        }

        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("Imaginea depășește dimensiunea maximă permisă de " + maxFileSize + " bytes.");
        }

        String contentType = file.getContentType();
        if (contentType == null || contentType.isBlank()) {
            String filename = file.getOriginalFilename();
            if (filename == null || !filename.toLowerCase().matches(".*\\.(png|jpe?g|gif|webp)$")) {
                throw new IllegalArgumentException("Fișierul încărcat trebuie să fie o imagine.");
            }
        } else if (!contentType.toLowerCase().startsWith("image/")) {
            throw new IllegalArgumentException("Fișierul încărcat trebuie să fie o imagine.");
        }
    }

    public record UploadedImage(String secureUrl, String publicId) {}
}