package com.opencbs.core.request.domain;

import com.opencbs.core.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;

@Entity
@Data
@Table(name = "checker_request")
public class CheckerRequest extends BaseEntity {

    @Column(name = "permission_id", nullable = false)
    private Long permissionId;

    @Column(name = "request_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private RequestType requestType;

}
