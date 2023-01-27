package com.opencbs.core.domain.customfields;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.enums.CustomFieldType;
import lombok.Builder;
import lombok.Data;
import org.hibernate.annotations.Where;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

@Data
@MappedSuperclass
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Where(clause = "deleted = false")
public abstract class CustomField<Tcfs extends CustomFieldSection> extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id")
    Tcfs section;

    @Column(name = "field_type", nullable = false)
    @Enumerated(value = EnumType.STRING)
    private CustomFieldType fieldType;

    @Column(name = "[name]", nullable = false, unique = true)
    private String name;

    @Column(name = "caption", nullable = false)
    private String caption;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "is_unique", nullable = false)
    private boolean unique;

    @Column(name = "is_required", nullable = false)
    private boolean required;

    @Column(name = "[order]", nullable = false)
    private int order;

    @Column(name = "extra")
    private CustomFieldExtra extra;

    @Builder.Default
    @Column(name = "deleted")
    private Boolean deleted = false;
}
