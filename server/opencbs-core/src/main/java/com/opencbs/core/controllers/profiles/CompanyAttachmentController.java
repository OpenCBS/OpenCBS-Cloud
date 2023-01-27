package com.opencbs.core.controllers.profiles;

import com.opencbs.core.domain.attachments.CompanyAttachment;
import com.opencbs.core.domain.profiles.Company;
import com.opencbs.core.dto.AttachmentDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.mappers.AttachmentMapper;
import com.opencbs.core.services.CompanyAttachmentService;
import com.opencbs.core.services.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/profiles/companies/{companyId}/attachments")
@SuppressWarnings("unused")
public class CompanyAttachmentController {

    private final CompanyService companyService;

    private final CompanyAttachmentService companyAttachmentsService;

    private final AttachmentMapper attachmentMapper;

    @Autowired
    public CompanyAttachmentController(CompanyService companyService,
                                       CompanyAttachmentService companyAttachmentsService,
                                       AttachmentMapper attachmentMapper) {
        this.companyService = companyService;
        this.companyAttachmentsService = companyAttachmentsService;
        this.attachmentMapper = attachmentMapper;
    }

    @GetMapping()
    public List<AttachmentDto> get(@PathVariable long companyId) {
        Company company = this.companyService
                .findOne(companyId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Company not found (ID=%d).", companyId)));

        return this.companyAttachmentsService.findByOwnerId(company.getId())
                .stream()
                .map(this.attachmentMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @PostMapping()
    public AttachmentDto post(@PathVariable long companyId,
                              @RequestParam("file") MultipartFile file,
                              @RequestParam(value = "comment", required = false) String comment) throws Exception {
        Company company = this.companyService
                .findOne(companyId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Company not found (ID=%d).", companyId)));

        CompanyAttachment attachment = this.companyAttachmentsService.create(file, company, UserHelper.getCurrentUser(), comment);
        return this.attachmentMapper.mapToDto(attachment);
    }

    @GetMapping(value = "/{attachmentId}")
    public ResponseEntity get(@PathVariable long attachmentId,
                              @RequestParam(value = "size", required = false) Integer size) throws Exception {
        CompanyAttachment attachment = this.companyAttachmentsService.findOne(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Attachment not found (ID=%d).", attachmentId)));

        return this.companyAttachmentsService.getResponseEntity(attachment, size);
    }

    @PostMapping(value = "/{attachmentId}/pin")
    public AttachmentDto pin(@PathVariable long attachmentId) {
        CompanyAttachment companyAttachment = this.companyAttachmentsService
                .findOne(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Attachment not found (ID=%d).", attachmentId)));
        companyAttachment = this.companyAttachmentsService.pin(companyAttachment);

        return this.attachmentMapper.mapToDto(companyAttachment);
    }

    @PostMapping(value = "/{attachmentId}/unpin")
    public AttachmentDto unpin(@PathVariable long attachmentId) {
        CompanyAttachment companyAttachment = this.companyAttachmentsService
                .findOne(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Attachment not found (ID=%d).", attachmentId)));
        companyAttachment = this.companyAttachmentsService.unpin(companyAttachment);

        return this.attachmentMapper.mapToDto(companyAttachment);
    }

    @DeleteMapping(value = "/{attachmentId}")
    public AttachmentDto delete(@PathVariable long attachmentId) throws Exception {
        CompanyAttachment companyAttachment = this.companyAttachmentsService
                .findOne(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Attachment not found(ID=%d).", attachmentId)));
        this.companyAttachmentsService.delete(companyAttachment);

        return this.attachmentMapper.mapToDto(companyAttachment);
    }
}
