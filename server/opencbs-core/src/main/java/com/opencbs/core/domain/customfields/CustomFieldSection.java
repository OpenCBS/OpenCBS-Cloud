package com.opencbs.core.domain.customfields;

import com.opencbs.core.domain.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
@MappedSuperclass
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public class CustomFieldSection<Tcf extends CustomField> extends BaseEntity {

    public CustomFieldSection() {
        this.customFields = new ArrayList<>();
    }

    @Column(name = "caption", nullable = false)
    private String caption;

    @Column(name = "[order]", nullable = false)
    private int order;

    @OrderBy("order asc")
    @OneToMany(mappedBy = "section", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @Where(clause = "deleted = false")
    List<Tcf> customFields;

    @Column(name = "code", nullable = false)
    private String code;
}
