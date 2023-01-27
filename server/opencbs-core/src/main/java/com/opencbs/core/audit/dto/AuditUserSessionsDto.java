package com.opencbs.core.audit.dto;

import com.opencbs.core.domain.UserSession;
import lombok.Data;

@Data
public class AuditUserSessionsDto extends AuditRecordDto {

    private UserSession.LoginActionType loginActionType;

    private String ip;

    private UserSession.LoginStatusType loginStatusType;
}
