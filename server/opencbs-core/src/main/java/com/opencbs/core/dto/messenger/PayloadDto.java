package com.opencbs.core.dto.messenger;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PayloadDto {

    private String exchange;

    private String routingKey;

    private Object payload;
}
