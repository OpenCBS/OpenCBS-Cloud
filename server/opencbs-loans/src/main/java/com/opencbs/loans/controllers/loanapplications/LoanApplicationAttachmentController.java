package com.opencbs.loans.controllers.loanapplications;

import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.dto.AttachmentDto;
import com.opencbs.core.exceptions.ApiException;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.mappers.AttachmentMapper;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.attachments.LoanApplicationAttachment;
import com.opencbs.loans.services.LoanApplicationAttachmentService;
import com.opencbs.loans.services.LoanApplicationService;
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
@RequestMapping(value = "/api/loan-applications/{loanApplicationId}/attachments")
public class LoanApplicationAttachmentController {

    private final LoanApplicationService loanApplicationService;
    private final LoanApplicationAttachmentService loanApplicationAttachmentService;
    private final AttachmentMapper attachmentMapper;

    @Autowired
    public LoanApplicationAttachmentController(LoanApplicationService loanApplicationService,
                                               LoanApplicationAttachmentService loanApplicationAttachmentService,
                                               AttachmentMapper attachmentMapper) {
        this.loanApplicationService = loanApplicationService;
        this.loanApplicationAttachmentService = loanApplicationAttachmentService;
        this.attachmentMapper = attachmentMapper;
    }

    @GetMapping()
    public List<AttachmentDto> get(@PathVariable long loanApplicationId) throws ApiException {
        LoanApplication loanApplication = this.loanApplicationService
                .findOne(loanApplicationId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan application not found (ID=%d).", loanApplicationId)));

        return loanApplicationAttachmentService.findByOwnerId(loanApplication.getId())
                .stream()
                .map(this.attachmentMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @GetMapping(value = "/{attachmentId}")
    @ResponseBody
    public ResponseEntity get(@PathVariable long attachmentId,
                              @RequestParam(value = "comment", required = false) String comment,
                              @RequestParam(value = "size", required = false) Integer size) throws Exception {
        LoanApplicationAttachment attachment = this.loanApplicationAttachmentService.findOne(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Attachment not found (ID=%d).", attachmentId)));

        return this.loanApplicationAttachmentService.getResponseEntity(attachment, size);
    }

    @PostMapping()
    @PermissionRequired(name = "ATTACHMENT", moduleType = ModuleType.LOAN_APPLICATIONS, description = "")
    public AttachmentDto post(@PathVariable long loanApplicationId,
                              @RequestParam("file") MultipartFile file,
                              @RequestParam(value = "comment", required = false) String comment) throws Exception {
        LoanApplication loanApplication = this.loanApplicationService
                .findOne(loanApplicationId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan application not found (ID=%d).", loanApplicationId)));

        LoanApplicationAttachment attachment = loanApplicationAttachmentService.create(file, loanApplication, UserHelper.getCurrentUser(), comment);
        return this.attachmentMapper.mapToDto(attachment);
    }

    @DeleteMapping(value = "/{attachmentId}")
    @PermissionRequired(name = "ATTACHMENT", moduleType = ModuleType.LOAN_APPLICATIONS, description = "")
    public AttachmentDto delete(@PathVariable long attachmentId) throws Exception {
        LoanApplicationAttachment attachment = this.loanApplicationAttachmentService
                .findOne(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Attachment not found (ID=%d).", attachmentId)));

        this.loanApplicationAttachmentService.delete(attachment);
        return this.attachmentMapper.mapToDto(attachment);
    }
}
