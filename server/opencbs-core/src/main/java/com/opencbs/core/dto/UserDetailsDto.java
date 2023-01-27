package com.opencbs.core.dto;

import com.opencbs.core.domain.enums.StatusType;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import lombok.Data;

@Data
public class UserDetailsDto extends BaseDto implements BaseRequestDto {

    private String username;
    private String firstName;
    private String lastName;
    private RoleDetailsDto role;
    private BranchDto branch;
    private String email;
    private String phoneNumber;
    private Boolean isAdmin;
    private String idNumber;
    private String address;
    private String position;
    private boolean isReadOnly;
    private StatusType statusType = StatusType.ACTIVE;

    public String getName() {
        return String.format("%s %s", this.firstName, this.lastName);
    }
}