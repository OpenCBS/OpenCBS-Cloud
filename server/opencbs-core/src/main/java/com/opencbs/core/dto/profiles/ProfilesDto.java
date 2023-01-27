package com.opencbs.core.dto.profiles;

import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.dto.BaseDto;
import lombok.Data;

@Data
public class ProfilesDto extends BaseDto {

    private String name;
    private String type;
    private EntityStatus status;
    private String branchName;

}
