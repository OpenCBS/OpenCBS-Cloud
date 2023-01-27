package com.opencbs.core.officedocuments.services;

import com.opencbs.core.configs.properties.TemplateProperty;
import com.opencbs.core.officedocuments.domain.Template;
import com.opencbs.core.officedocuments.repositories.DocumentRepository;
import org.springframework.util.Assert;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

public abstract class AbstractDocumentService<T extends Template> {
    final TemplateProperty templateProperty;
    public final DocumentRepository documentRepository;

    List<T> templateData;

    public AbstractDocumentService(TemplateProperty templateProperty,
                                   DocumentRepository documentRepository) throws Exception {
        this.templateProperty = templateProperty;
        this.documentRepository = documentRepository;
        this.templateData = this.loadPrintingForms();
    }

    public List<T> getDocumentByPoint(String point) throws Exception {
        if (this.templateData.isEmpty()) {
            templateData = this.loadPrintingForms();
        }

        if (this.getFileList(this.getPath()).size() != this.templateData.size()) {
            templateData = this.loadPrintingForms();
        }

        return templateData
                .stream()
                .filter(x -> x.getPoint().equals(point))
                .collect(Collectors.toList());
    }

    abstract Path getPath();

    abstract <E extends Closeable> E getDocumentFromInputStream(InputStream is) throws IOException;

    abstract String getDocumentPattern();

    abstract int getScriptOrder(String name) throws IOException;

    abstract T getDocumentMeta(InputStream is) throws IOException;

    ZipFile loadZipFile(Path path) throws IOException {
        return new ZipFile(path.toString());
    }

    protected void validateObject(Object o, String message) {
        if (o == null) {
            throw new RuntimeException(message);
        }
    }

    protected Map<String, Object> loadTemplate(Path path) throws IOException {
        ZipFile file = loadZipFile(path);
        Enumeration<? extends ZipEntry> entries = file.entries();
        HashMap<String, Object> map = new HashMap<>();

        Map<Integer, String> scripts = new HashMap<>();
        Map<Integer, String> staticScripts = new HashMap<>();

        while (entries.hasMoreElements()) {
            ZipEntry entry = entries.nextElement();
            if (this.patternMatch(this.getDocumentPattern(), entry.getName())) {
                map.put("template", this.getDocumentFromInputStream(file.getInputStream(entry))); //TODO: solve NoSuchMethodException
            }
            if (this.patternMatch(".+static\\.sql$", entry.getName())) {
                staticScripts.put(this.getScriptOrder(entry.getName()),
                        this.convertToString(file.getInputStream(entry)));
                continue;
            }
            if (this.patternMatch(".+\\.sql$", entry.getName())) {
                scripts.put(this.getScriptOrder(entry.getName()),
                        this.convertToString(file.getInputStream(entry)));
            }
            if (this.patternMatch(".+\\.json$", entry.getName())) {
                map.put("json", this.convertToString(file.getInputStream(entry)));
            }
        }
        map.put("scripts", scripts);
        map.put("staticScripts", staticScripts);
        return map;
    }

    Optional<T> loadTemplateData(Path path) throws IOException {
        ZipFile file = loadZipFile(path);
        Enumeration<? extends ZipEntry> entries = file.entries();

        while (entries.hasMoreElements()) {
            ZipEntry entry = entries.nextElement();
            if (this.patternMatch(".+\\.json$", entry.getName())) {
                return Optional.of(this.getDocumentMeta(file.getInputStream(entry)));
            }
        }
        return Optional.empty();
    }

    List<T> loadPrintingForms() throws Exception {
        Path templatePath = this.getPath();
        this.createDirectoryIfNotExist(templatePath);
        List<T> templateData = getTemplatesFromPath(templatePath);

//        URL templateResource = this.getClass().getResource("/templates");
//        if(templateResource!=null) {
//            templatePath = Paths.get(templateResource.toURI());
//            templatePath = templatePath.resolve(this.getTemplateFolderName());
//            templateData.addAll(getTemplatesFromPath(templatePath));
//        }

        templateData.sort(Comparator.comparing(td -> td.getName()));
        Integer id = 0;
        for (T template : templateData) {
            template.setId(id++);
        }
        return templateData;
    }

    private List<T> getTemplatesFromPath(Path templatePath) throws IOException {
        List<T> templateData = new ArrayList<>();
        Set<String> nameSet = new HashSet<>();
        for (Path path : this.getFileList(templatePath)) {
            this.loadTemplateData(path).ifPresent(x -> {
                Assert.notNull(x.getName(), String.format("Printing form has not system name(%s).", x.getLabel()));
                if (nameSet.contains(x.getName())) {
                    throw new RuntimeException(String.format("Printing form system name should be unique(%s).", x.getLabel()));
                }
                x.setPath(path);
                templateData.add(x);
                nameSet.add(x.getName());
            });
        }
        return templateData;
    }

    List<Path> getFileList(Path path) throws IOException {
        if (!Files.exists(path)) {
            return Collections.emptyList();
        }
        return Files.list(path).filter(x -> this.patternMatch(".+\\.zip$", x.toString()))
                .collect(Collectors.toList());
    }

    boolean patternMatch(String pattern, String fileName) {
        return Pattern.compile(pattern).matcher(fileName).find();
    }

    String convertToString(InputStream inputStream) throws IOException {
        try (BufferedReader bufferedReader = new BufferedReader(
                new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
            return bufferedReader
                    .lines()
                    .collect(Collectors.joining(System.lineSeparator()));
        }
    }

    void createDirectoryIfNotExist(Path path) {
        File directory = new File(path.toString());
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }

    protected T getTemplate(long templateId) {
        Stream<T> b = this.templateData
                .stream()
                .filter(x -> x.getId() == templateId);
        T a = b.findFirst()
                .get();
        return a;
    }

    public T getTemplateByName(String name) {
        return this.templateData
                .stream()
                .filter(x -> x.getName().equals(name))
                .findFirst()
                .get();
    }

    protected String getScriptByOrder(Map<String, Object> zipMap, int id, String type) {
        return (String) ((Map<Integer, Object>) zipMap.get(type)).getOrDefault(id, null);
    }

    public List getAllDocument() throws Exception {
        if (this.templateData.isEmpty()) {
            templateData = this.loadPrintingForms();
        }

        if (this.getFileList(this.getPath()).size() != this.templateData.size()) {
            templateData = this.loadPrintingForms();
        }

        return templateData;
    }

    abstract String getTemplateFolderName();
}
