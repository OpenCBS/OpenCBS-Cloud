package com.opencbs.core.dto;

import lombok.Data;

@Data
public class ChangesInfoDto {
   private String oldValue;

   private String newValue;

   private String fieldCaption;

   private String changedAt;

   private UserInfoDto changedBy;
}
