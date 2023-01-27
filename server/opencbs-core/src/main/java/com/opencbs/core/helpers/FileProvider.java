package com.opencbs.core.helpers;

import com.opencbs.core.exceptions.ValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Component
public class FileProvider {
    public void save(MultipartFile file, Path path) throws ValidationException {
        Assert.notNull(file, "File can not be null");
        Assert.isTrue(!file.isEmpty(), "Failed to store empty file " + file.getOriginalFilename());
        Assert.notNull(path, "Path can not be null");
        try {
            Files.createDirectories(path.getParent());
            Files.copy(file.getInputStream(), path);
        } catch (IOException e) {
            throw new ValidationException("Failed to store file " + file.getOriginalFilename());
        }
    }


    public void delete(Path path) throws ValidationException {
        Assert.notNull(path, "Path can not be null");
        try {
            Files.delete(path);
        } catch (IOException e) {
            throw new ValidationException("Failed to delete file.");
        }
    }


    public Resource loadAsResource(Path filePath) throws ValidationException {
        try {
            Resource resource = new UrlResource(filePath.toUri());
            if(resource.exists() || resource.isReadable()) {
                return resource;
            }

            throw new ValidationException("Could not read requested file");
        } catch (MalformedURLException e) {
            throw new ValidationException("Could not read requested file");
        }
    }

    public static Map<Integer, String> getReportScripts(Map<Integer, String> scriptNames) throws ValidationException {
        HashMap result = new HashMap();

        for(Integer i = 0; i < scriptNames.size(); i++)
            result.put(i, getScript(scriptNames.get(i), "db/reports"));

        return result;
    }

    public static String getLoanScript(String scriptName) throws ValidationException {
        return getScript(scriptName, "db/loan");
    }

    public static String getEmail(String fileName) throws ValidationException {
        return getScript(fileName, "email");
    }

    private static String getScript(String fileName, String path) throws ValidationException {
        try {
            FileProvider thisClass = new FileProvider();
            InputStream is = thisClass.getClass().getClassLoader().getResourceAsStream(path + "/" + fileName);
            BufferedReader reader = new BufferedReader(new InputStreamReader(is));
            return reader.lines().collect(Collectors.joining("\n"));
        } catch (Exception e) {
            log.error(e.toString());
            throw new ValidationException("Failed to getOne script of report: " + path + fileName);
        }
    }
}