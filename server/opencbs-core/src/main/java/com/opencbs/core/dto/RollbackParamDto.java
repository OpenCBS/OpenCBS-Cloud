package com.opencbs.core.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RollbackParamDto extends CommentDto {

    private LocalDate date;
}