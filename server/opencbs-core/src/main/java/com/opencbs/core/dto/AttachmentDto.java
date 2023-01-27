package com.opencbs.core.dto;

import lombok.Data;

@Data
public class AttachmentDto extends BaseDto {

    private String originalFilename;

    private String contentType;

    private String createdAt;

    private UserInfoDto createdBy;

    private boolean pinned;

    private String comment;
}
