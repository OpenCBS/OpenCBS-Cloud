package com.opencbs.core.audit.dto;

import com.opencbs.core.request.domain.RequestActionType;
import com.opencbs.core.request.domain.RequestType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuditBusinessObjectRecordDto extends AuditRecordDto {

    private RequestActionType action;

    private String description;

    private Long objectId;

    private RequestType requestType;
}