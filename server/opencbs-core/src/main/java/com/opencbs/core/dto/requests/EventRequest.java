package com.opencbs.core.dto.requests;

import lombok.Data;

@Data
public class EventRequest {
    private boolean showDeleted;
    private boolean showSystem;
}
