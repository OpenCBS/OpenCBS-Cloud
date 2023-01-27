package com.opencbs.core.dto;

import lombok.Data;

@Data
public class PasswordUpdateDto {
    private Long userId;
    private String password;
}
