package com.opencbs.core.controllers.profiles;

import com.opencbs.core.domain.attachments.GroupAttachment;
import com.opencbs.core.domain.profiles.Group;
import com.opencbs.core.dto.AttachmentDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.mappers.AttachmentMapper;
import com.opencbs.core.services.GroupAttachmentService;
import com.opencbs.core.services.GroupService;
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
@RequestMapping(value = "/api/profiles/groups/{groupId}/attachments")
@SuppressWarnings("unused")
public class GroupAttachmentController {

    private final GroupService groupService;

    private final GroupAttachmentService groupAttachmentService;

    private final AttachmentMapper attachmentMapper;

    @Autowired
    public GroupAttachmentController(GroupService groupService,
                                     GroupAttachmentService groupAttachmentService,
                                     AttachmentMapper attachmentMapper) {
        this.groupService = groupService;
        this.groupAttachmentService = groupAttachmentService;
        this.attachmentMapper = attachmentMapper;
    }

    @PostMapping()
    public AttachmentDto post(@PathVariable long groupId,
                              @RequestParam("file") MultipartFile file,
                              @RequestParam(value = "comment", required = false) String comment) throws Exception {
        Group group = this.groupService
                .findOne(groupId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Group not found (ID=%d).", groupId)));

        GroupAttachment attachment = groupAttachmentService.create(file, group, UserHelper.getCurrentUser(), comment);
        return this.attachmentMapper.mapToDto(attachment);
    }

    @GetMapping()
    public List<AttachmentDto> get(@PathVariable long groupId) {
        Group group = this.groupService
                .findOne(groupId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Group not found (ID=%d).", groupId)));

        return this.groupAttachmentService.findByOwnerId(group.getId())
                .stream()
                .map(this.attachmentMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @GetMapping(value = "/{attachmentId}")
    public ResponseEntity get(@PathVariable long attachmentId,
                              @RequestParam(value = "size", required = false) Integer size) throws Exception {
        GroupAttachment attachment = this.groupAttachmentService.findOne(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Attachment not found (ID=%d).", attachmentId)));

        return this.groupAttachmentService.getResponseEntity(attachment, size);
    }

    @PostMapping(value = "/{attachmentId}/pin")
    public AttachmentDto pin(@PathVariable long attachmentId) {
        GroupAttachment companyAttachment = this.groupAttachmentService
                .findOne(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Attachment not found (ID=%d).", attachmentId)));
        companyAttachment = this.groupAttachmentService.pin(companyAttachment);

        return this.attachmentMapper.mapToDto(companyAttachment);
    }

    @PostMapping(value = "/{attachmentId}/unpin")
    public AttachmentDto unpin(@PathVariable long attachmentId) {
        GroupAttachment companyAttachment = this.groupAttachmentService
                .findOne(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Attachment not found (ID=%d).", attachmentId)));
        companyAttachment = this.groupAttachmentService.unpin(companyAttachment);

        return this.attachmentMapper.mapToDto(companyAttachment);
    }

    @DeleteMapping(value = "/{attachmentId}")
    public AttachmentDto delete(@PathVariable long attachmentId) throws Exception {
        GroupAttachment companyAttachment = this.groupAttachmentService
                .findOne(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Attachment not found(ID=%d).", attachmentId)));
        this.groupAttachmentService.delete(companyAttachment);

        return this.attachmentMapper.mapToDto(companyAttachment);
    }
}
