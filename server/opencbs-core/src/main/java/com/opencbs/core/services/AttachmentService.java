package com.opencbs.core.services;

import com.opencbs.core.configs.properties.AttachmentProperty;
import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.attachments.Attachment;
import com.opencbs.core.exceptions.ValidationException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.FileProvider;
import com.opencbs.core.repositories.AttachmentRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public abstract class AttachmentService<Towner extends BaseEntity,
        Tattachment extends Attachment,
        Trepo extends AttachmentRepository<Tattachment>> {

    private final Trepo repository;

    private final FileProvider fileProvider;

    private final AttachmentProperty attachmentProperty;

    private final Class<Tattachment> clazz;

    public AttachmentService(Trepo repository,
                      FileProvider fileProvider,
                      AttachmentProperty attachmentProperty,
                      Class<Tattachment> clazz) {
        this.repository = repository;
        this.fileProvider = fileProvider;
        this.attachmentProperty = attachmentProperty;
        this.clazz = clazz;
    }

    @Transactional
    public Tattachment create(MultipartFile file, Towner owner, User currentUser, String comment) throws Exception {
        Tattachment attachment = clazz.newInstance();

        String fileExtension = this.getFileExtension(file.getOriginalFilename());
        String name = UUID.randomUUID().toString().concat(fileExtension);

        attachment.setOwner(owner);
        attachment.setFilename(name);
        attachment.setOriginalFilename(file.getOriginalFilename());
        attachment.setContentType(file.getContentType());
        attachment.setCreatedAt(DateHelper.getLocalDateTimeNow());
        attachment.setCreatedBy(currentUser);
        attachment.setComment(comment);
        this.fileProvider.save(file, this.getPath(attachment));

        try {
            return this.repository.save(attachment);
        } catch (Exception e) {
            this.fileProvider.delete(this.getPath(attachment));
            throw new ValidationException("Failed to store file " + file.getOriginalFilename());
        }
    }

    @Transactional
    public Tattachment update(Tattachment attachment) {
        return this.repository.save(attachment);
    }

    @Transactional
    public void delete(Tattachment attachment) throws Exception {
        this.fileProvider.delete(this.getPath(attachment));//TODO: add logic for transactional way
        this.repository.delete(attachment);
    }

    public Tattachment pin(Tattachment attachment) {
        attachment.setPinned(true);
        return this.update(attachment);
    }

    public Tattachment unpin(Tattachment attachment) {
        attachment.setPinned(false);
        return this.update(attachment);
    }

    public Optional<Tattachment> findOne(Long id) {
        return Optional.ofNullable(this.repository.findOne(id));
    }

    public List<Tattachment> findByOwnerId(Long id) {
        return this.repository.findByOwnerId(id)
                .stream()
                .sorted(Comparator.comparing(Attachment::getCreatedAt))
                .collect(Collectors.toList());
    }

    protected abstract String getSubfolder();

    public ResponseEntity getResponseEntity(Attachment attachment, Integer size) throws Exception {
        ResponseEntity.BodyBuilder bodyBuilder = ResponseEntity
                .ok()
                .header(HttpHeaders.CONTENT_TYPE, attachment.getContentType())
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attachment.getFilename() + "\"");

        if (this.isPicture(attachment.getContentType())) {
            return bodyBuilder.body(
                    size == null
                            ? this.getPictureContent(attachment)
                            : this.getResizedPictureContent(attachment, size)
            );
        }

        return bodyBuilder.body(fileProvider.loadAsResource(this.getPath(attachment)));
    }

    private Path getPath(Attachment attachment) {
        return this.attachmentProperty.getPath().resolve(this.getSubfolder())
                .resolve(attachment.getOwner().getId().toString())
                .resolve(attachment.getFilename());
    }

    private byte[] getPictureContent(Attachment attachment) throws Exception {
        BufferedImage image = ImageIO.read(this.getPath(attachment).toFile());
        ByteArrayOutputStream bos = new ByteArrayOutputStream();

        ImageIO.write(image, this.getImageFormatName(attachment.getContentType()), bos);
        return bos.toByteArray();
    }

    private byte[] getResizedPictureContent(Attachment attachment, int size) throws Exception {
        BufferedImage image = ImageIO.read(getPath(attachment).toFile());
        int type = image.getType() == 0 ? BufferedImage.TYPE_INT_ARGB : image.getType();

        image = this.resize(image, type, size);

        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ImageIO.write(image, this.getImageFormatName(attachment.getContentType()), bos);
        return bos.toByteArray();
    }

    private String getImageFormatName(String contentType) {
        switch (contentType) {
            case "image/png":
                return "png";

            case "image/jpeg":
                return "jpg";

            default:
                return "";
        }
    }

    private BufferedImage resize(BufferedImage image, int type, int size) {
        int width = image.getWidth();
        int height = image.getHeight();

        if (width > height) {
            height = size * height / width;
            width = size;
        } else {
            width = size * width / height;
            height = size;
        }

        BufferedImage resizedImage = new BufferedImage(size, size, type);
        Graphics2D g = resizedImage.createGraphics();
        g.drawImage(image, 0, 0, width, height, null);
        g.dispose();
        g.setComposite(AlphaComposite.Src);

        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        return resizedImage;
    }

    private boolean isPicture(String contentType) {
        return Stream.of("image/png", "image/jpeg").anyMatch(x -> x.equals(contentType));
    }

    private String getFileExtension(String fileName) {
        Pattern pattern = Pattern.compile("(\\.[^.]+)$");
        Matcher matcher = pattern.matcher(fileName);
        return matcher.find() ? matcher.group(1) : "";
    }
}
