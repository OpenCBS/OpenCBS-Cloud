package com.opencbs.core.domain.profiles;

import com.opencbs.core.domain.attachments.PersonAttachment;
import com.opencbs.core.domain.customfields.CustomFieldValue;
import com.opencbs.core.domain.customfields.PersonCustomFieldValue;
import com.opencbs.core.domain.enums.EntityStatus;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.CascadeType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
@Audited
@Data
@DiscriminatorValue("PERSON")
public class Person extends Profile {

    @OneToMany(mappedBy = "owner", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<PersonCustomFieldValue> customFieldValues;

    @OneToMany(mappedBy = "owner", cascade = {CascadeType.REFRESH})
    private List<PersonAttachment> attachments;

    @Override
    public String getNameFromCustomFields() {
        String firstName = this.customFieldValues
                .stream()
                .filter(x -> x.getCustomField().getName().equals("first_name"))
                .filter(i -> i.getStatus().equals(EntityStatus.LIVE))
                .map(CustomFieldValue::getValue)
                .findFirst()
                .orElse(this.customFieldValues
                        .stream()
                        .filter(x -> x.getCustomField().getName().equals("first_name"))
                        .filter(i -> i.getStatus().equals(EntityStatus.PENDING))
                        .map(CustomFieldValue::getValue)
                        .findFirst()
                        .orElse(""));

        String lastName = this.customFieldValues
                .stream()
                .filter(x -> x.getCustomField().getName().equals("last_name"))
                .filter(i -> i.getStatus().equals(EntityStatus.LIVE))
                .map(CustomFieldValue::getValue)
                .findFirst()
                .orElse(this.customFieldValues
                        .stream()
                        .filter(x -> x.getCustomField().getName().equals("last_name"))
                        .filter(i -> i.getStatus().equals(EntityStatus.PENDING))
                        .map(CustomFieldValue::getValue)
                        .findFirst()
                        .orElse(""));

        return firstName + " " + lastName;
    }
}