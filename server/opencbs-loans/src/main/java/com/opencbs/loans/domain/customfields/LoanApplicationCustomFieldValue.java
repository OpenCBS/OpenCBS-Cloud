package com.opencbs.loans.domain.customfields;

import com.opencbs.core.domain.customfields.CustomFieldValue;
import com.opencbs.loans.domain.LoanApplication;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Data
@Table(name = "loan_application_custom_fields_values")
public class LoanApplicationCustomFieldValue extends CustomFieldValue<LoanApplicationCustomField> {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private LoanApplication owner;

    @Override
    public Long getOwnerId() {
        return owner.getId();
    }
}
