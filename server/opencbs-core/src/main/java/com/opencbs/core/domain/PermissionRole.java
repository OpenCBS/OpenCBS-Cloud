package com.opencbs.core.domain;

import lombok.Data;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Data
@Table(name = "roles_permissions")
public class PermissionRole extends BaseEntity {

    @Column(name = "role_id", nullable = false)
    private Long roleId;

    @Column(name = "permission_id", nullable = false)
    private Long permissionId;
}
