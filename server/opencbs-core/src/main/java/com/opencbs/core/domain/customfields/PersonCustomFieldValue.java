package com.opencbs.core.domain.customfields;

import com.opencbs.core.domain.profiles.Person;
import lombok.Data;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;
import org.hibernate.envers.RelationTargetAuditMode;

import javax.persistence.*;

@Entity
@Audited
@AuditOverride(forClass = CustomFieldValue.class)
@Table(name = "people_custom_fields_values")
@Data
public class PersonCustomFieldValue extends CustomFieldValue<PersonCustomField> {

    @Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private Person owner;

    @Override
    public Long getOwnerId() {
        return owner.getId();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;

        PersonCustomFieldValue that = (PersonCustomFieldValue) o;

        return owner != null ? owner.getId().equals(that.owner.getId()) : that.owner == null;
    }

    @Override
    public int hashCode() {
        int result = super.hashCode();
        return result;
    }

    @Override
    public String toString() {
        return super.toString();
    }
}
