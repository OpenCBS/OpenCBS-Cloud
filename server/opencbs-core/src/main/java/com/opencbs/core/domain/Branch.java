package com.opencbs.core.domain;

import com.opencbs.core.domain.customfields.BranchCustomFieldValue;
import lombok.Data;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.List;

@Entity
@Data
@Table(name = "branches")
public class Branch extends NamedBaseEntity {

    @OneToMany(mappedBy = "owner", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private List<BranchCustomFieldValue> customFieldValues;

    @Override
    public String toString() {
        return this.getName();
    }
}
