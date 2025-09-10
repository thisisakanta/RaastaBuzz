package com.raastabuzz.service;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service

public class FirebaseStorageService {

    private final Storage storage;

    @Value("${firebase.storage.bucket}")
    private String bucketName;

    private static final String TRAFFIC_REPORTS_FOLDER = "traffic-reports";
    public FirebaseStorageService(Storage storage) {
        this.storage = storage;
    }

    public String uploadReportImage(MultipartFile file, Long reportId) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        String fileName = "report_" + reportId + "_" + UUID.randomUUID() + getFileExtension(file.getOriginalFilename());
        String objectName = TRAFFIC_REPORTS_FOLDER + "/" + reportId + "/" + fileName;

        BlobId blobId = BlobId.of(bucketName, objectName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(file.getContentType())
                .setCacheControl("public, max-age=31536000")
                .build();

        storage.create(blobInfo, file.getBytes());

//        log.info("Traffic report image uploaded for reportId: {} with blob name: {}", reportId, objectName);

        return String.format("https://firebasestorage.googleapis.com/v0/b/%s/o/%s?alt=media",
                bucketName, objectName.replace("/", "%2F"));
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf('.') == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf('.'));
    }
}