package com.opencbs.core.dto.group;

import com.opencbs.core.dto.BaseDto;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GroupsMembersDto extends BaseDto {

    private String name;

    private String type;

    private Long groupId;

    private Long memberId;

    private LocalDateTime joinDate;

    private LocalDateTime leftDate;

}
