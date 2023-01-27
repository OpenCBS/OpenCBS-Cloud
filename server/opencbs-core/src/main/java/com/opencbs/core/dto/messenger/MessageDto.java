package com.opencbs.core.dto.messenger;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MessageDto {

    private MessageType messageType;

    private Object payload;
}
