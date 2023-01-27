package com.opencbs.core.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.attachments.Attachment;
import com.opencbs.core.dto.AttachmentDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.services.UserService;
import org.modelmapper.ModelMapper;

@Mapper
public class AttachmentMapper {

    private final UserService userService;

    public AttachmentMapper(UserService userService) {
        this.userService = userService;
    }

    public AttachmentDto mapToDto(Attachment attachment) {
        User user = this.userService.findById(attachment.getCreatedBy().getId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found (ID=%d).", attachment.getCreatedBy().getId())));
        attachment.setCreatedBy(user);
        return new ModelMapper().map(attachment, AttachmentDto.class);
    }
}
