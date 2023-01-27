package com.opencbs.core.domain;

import com.opencbs.core.domain.enums.CustomFieldType;
import com.opencbs.core.domain.enums.SystemSettingsName;
import com.opencbs.core.domain.enums.SystemSettingsSections;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;

@Entity
@Data
@Table(name = "system_settings")
public class SystemSettings extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "name", nullable = false)
    private SystemSettingsName name;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private CustomFieldType type;

    @Column(name = "value", nullable = false)
    private String value;

    @Enumerated(EnumType.STRING)
    @Column(name = "section", nullable = false)
    private SystemSettingsSections section;

}
