package com.opencbs.core.request.dto;

import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class BaseRequestDetailsDto extends BaseDto {

    private String type;
    private String createdByFirstName;
    private String createdByLastName;
    private LocalDateTime createdAt;
    private LocalDate expireDate;
    private Long entityId;
}
