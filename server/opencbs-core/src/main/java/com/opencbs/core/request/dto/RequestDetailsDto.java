package com.opencbs.core.request.dto;

import com.opencbs.core.request.interfaces.BaseRequestDto;
import lombok.Data;

@Data
public class RequestDetailsDto extends BaseRequestDetailsDto {

    private BaseRequestDto content;

}
