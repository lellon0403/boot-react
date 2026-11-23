package org.zerock.mallapi.util;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.coobird.thumbnailator.Thumbnails;

@Component
@Log4j2
@RequiredArgsConstructor
public class CustomFileUtil {

	@Value("${org.zerock.upload.path}")
	private String uploadPath;

	@PostConstruct
	public void init() {
		File tempFolder = new File(uploadPath);
		try {
			Files.createDirectories(tempFolder.toPath());
		} catch (IOException e) {
			throw new IllegalStateException(e);
		}
		uploadPath = tempFolder.getAbsolutePath();
		log.info("-------------------------------------");
		log.info(uploadPath);
	}

	public List<String> saveFiles(List<MultipartFile> files) throws RuntimeException {
		if (files == null || files.size() == 0) {
			return List.of();
		}
		List<String> uploadNames = new ArrayList<>();
		for (MultipartFile multipartFile : files) {
			if (multipartFile.isEmpty()) {
				continue;
			}
			String originalName = multipartFile.getOriginalFilename();
			if (originalName == null) {
				originalName = "file";
			}
			originalName = Paths.get(originalName.replace('\\', '/')).getFileName().toString();
			String savedName = UUID.randomUUID().toString() + "_" + originalName;
			Path savePath = resolvePath(savedName);
			try (InputStream input = multipartFile.getInputStream()) {
				Files.copy(input, savePath);

				String contentType = multipartFile.getContentType();
				if (contentType != null && contentType.startsWith("image")) {
					Path thumbnailPath = Paths.get(uploadPath, "s_" + savedName);
					Thumbnails.of(savePath.toFile())
							.size(200, 200)
							.toFile(thumbnailPath.toFile());
				}

				uploadNames.add(savedName);
			} catch (IOException e) {
				throw new RuntimeException(e);
			}
		}
		return uploadNames;
	}

	public ResponseEntity<Resource> getFile(String fileName) {
		Resource resource = new FileSystemResource(resolvePath(fileName));
		if (!resource.exists()) {
			resource = new FileSystemResource(uploadPath + File.separator + "default.jpeg");
		}
		if (!resource.exists()) {
			return ResponseEntity.notFound().build();
		}
		HttpHeaders headers = new HttpHeaders();
		try {
			String contentType = Files.probeContentType(resource.getFile().toPath());
			headers.add("Content-Type", contentType == null ? "application/octet-stream" : contentType);
		} catch (Exception e) {
			return ResponseEntity.internalServerError().build();
		}
		return ResponseEntity.ok().headers(headers).body(resource);
	}

	public void deleteFiles(List<String> fileNames) {
		if (fileNames == null || fileNames.size() == 0) {
			return;
		}
		fileNames.forEach(fileName -> {
			String thumbnailFileName = "s_" + fileName;
			Path thumbnailPath = resolvePath(thumbnailFileName);
			Path filePath = resolvePath(fileName);
			try {
				Files.deleteIfExists(filePath);
				Files.deleteIfExists(thumbnailPath);
			} catch (IOException e) {
				throw new RuntimeException(e);
			}
		});
	}

	private Path resolvePath(String fileName) {
		Path root = Paths.get(uploadPath).toAbsolutePath().normalize();
		Path path = root.resolve(fileName).normalize();
		if (!path.startsWith(root) || !root.equals(path.getParent())) {
			throw new IllegalArgumentException("Invalid file name");
		}
		return path;
	}
}
