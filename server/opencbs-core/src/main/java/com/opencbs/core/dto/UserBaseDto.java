package com.opencbs.core.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserBaseDto extends BaseDto {

    private String firstName;
    private String lastName;
    private String email;
}

