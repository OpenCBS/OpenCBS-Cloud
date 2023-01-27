package com.opencbs.core.livechat.dtos;

import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageDto extends BaseDto {

    private String userFirstName;

    private String userLastName;

    private LocalDateTime createdAt;

    private String payload;
}