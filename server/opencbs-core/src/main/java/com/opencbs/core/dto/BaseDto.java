package com.opencbs.core.dto;

import com.opencbs.core.request.interfaces.BaseRequestDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseDto implements BaseRequestDto {

    private long id;
}
