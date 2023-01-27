package com.opencbs.core.domain.profiles;

import com.opencbs.core.domain.attachments.CompanyAttachment;
import com.opencbs.core.domain.customfields.CompanyCustomFieldValue;
import com.opencbs.core.domain.enums.EntityStatus;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;

import javax.persistence.CascadeType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Audited
@DiscriminatorValue("COMPANY")
public class Company extends Profile {

    @OneToMany(mappedBy = "owner", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<CompanyCustomFieldValue> customFieldValues;

    @NotAudited
    @OneToMany(mappedBy = "owner", cascade = {CascadeType.REFRESH})
    private List<CompanyAttachment> attachments;

    @OneToMany
    @JoinColumn(name = "company_id")
    private List<CompanyMember> companyMembers;

    @Override
    public String getNameFromCustomFields() {
        return this.customFieldValues
                .stream()
                .filter(x -> x.getCustomField().getName().equals("name"))
                .filter(i -> i.getStatus().equals(EntityStatus.LIVE))
                .map(CompanyCustomFieldValue::getValue)
                .findFirst()
                .orElse(this.customFieldValues
                        .stream()
                        .filter(x -> x.getCustomField().getName().equals("name"))
                        .filter(i -> i.getStatus().equals(EntityStatus.PENDING))
                        .map(CompanyCustomFieldValue::getValue)
                        .findFirst()
                        .orElse(""));
    }

}
