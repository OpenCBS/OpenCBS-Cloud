package com.opencbs.core.dto;

import com.opencbs.core.domain.enums.StatusType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserInfoDto extends BaseDto {

    private String username;
    private String firstName;
    private String lastName;
    private long roleId;
    private String roleName;
    private Integer branchId;
    private String email;
    private String phoneNumber;
    private String idNumber;
    private String address;
    private String position;
    private LocalDate expireDate;
    private StatusType statusType = StatusType.ACTIVE;
}
