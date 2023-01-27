package com.opencbs.core.domain.customfields;

import com.opencbs.core.domain.CreationInfoEntity;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.EntityStatus;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@Audited
@MappedSuperclass
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Data
public abstract class CustomFieldValue<Tcf extends CustomField> extends CreationInfoEntity {

    @Column(name = "value", nullable = false)
    private String value;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_id", nullable = false)
    Tcf customField;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by_id")
    private User verifiedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EntityStatus status;

    public abstract Long getOwnerId();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;

        CustomFieldValue<?> that = (CustomFieldValue<?>) o;

        if (getValue() != null ? !getValue().equals(that.getValue()) : that.getValue() != null) return false;
        return getStatus() == that.getStatus();
    }

    @Override
    public int hashCode() {
        return super.hashCode();
    }

    @Override
    public String toString() {
        return value;
    }
}
