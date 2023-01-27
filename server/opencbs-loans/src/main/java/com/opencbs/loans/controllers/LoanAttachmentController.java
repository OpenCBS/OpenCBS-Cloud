package com.opencbs.loans.controllers;

import com.opencbs.core.dto.AttachmentDto;
import com.opencbs.core.exceptions.ApiException;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.mappers.AttachmentMapper;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.attachments.LoanAttachment;
import com.opencbs.loans.services.LoanAttachmentService;
import com.opencbs.loans.services.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/loans/{loanId}/attachments")
public class LoanAttachmentController {

    private final LoanService loanService;
    private final LoanAttachmentService loanAttachmentService;
    private final AttachmentMapper attachmentMapper;

    @Autowired
    public LoanAttachmentController(LoanService loanService, LoanAttachmentService loanAttachmentService, AttachmentMapper attachmentMapper) {
        this.loanService = loanService;
        this.loanAttachmentService = loanAttachmentService;
        this.attachmentMapper = attachmentMapper;
    }

    @GetMapping()
    public List<AttachmentDto> get(@PathVariable long loanId) throws ApiException {
        Loan loan = this.loanService
                .findOne(loanId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan not found (ID=%d).", loanId)));

        return loanAttachmentService.findByOwnerId(loan.getId())
                .stream()
                .map(this.attachmentMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @GetMapping(value = "/{attachmentId}")
    @ResponseBody
    public ResponseEntity get(@PathVariable long attachmentId, @RequestParam(value = "size", required = false) Integer size) throws Exception {
        LoanAttachment attachment = this.loanAttachmentService.findOne(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Attachment not found (ID=%d).", attachmentId)));

        return this.loanAttachmentService.getResponseEntity(attachment, size);
    }

    @PostMapping()
    public AttachmentDto post(@PathVariable long loanId,
                              @RequestParam("file")MultipartFile file,
                              @RequestParam(value = "comment", required = false) String comment) throws Exception {
        Loan loan = this.loanService
                .findOne(loanId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan not found (ID=%d).", loanId)));

        LoanAttachment attachment = loanAttachmentService.create(file, loan, UserHelper.getCurrentUser(), comment);
        return this.attachmentMapper.mapToDto(attachment);
    }

    @DeleteMapping(value = "/{attachmentId}")
    public AttachmentDto delete(@PathVariable long attachmentId) throws Exception {
        LoanAttachment attachment = this.loanAttachmentService
                .findOne(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Attachment not found (ID=%d).", attachmentId)));

        this.loanAttachmentService.delete(attachment);
        return this.attachmentMapper.mapToDto(attachment);
    }
}