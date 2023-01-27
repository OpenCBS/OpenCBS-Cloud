package com.opencbs.core.domain.profiles;

import com.opencbs.core.domain.NamedEntity;
import com.opencbs.core.domain.attachments.GroupAttachment;
import com.opencbs.core.domain.customfields.GroupCustomFieldValue;
import com.opencbs.core.domain.enums.EntityStatus;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.CascadeType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import java.util.List;

@Data
@Audited
@Entity
@DiscriminatorValue("GROUP")
public class Group extends Profile implements NamedEntity {

    @OneToMany(mappedBy = "owner", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<GroupCustomFieldValue> customFieldValues;

    @OneToMany(mappedBy = "owner", cascade = {CascadeType.REFRESH})
    private List<GroupAttachment> attachments;

    @OneToMany
    @JoinColumn(name = "group_id")
    private List<GroupMember> groupMembers;

    @Override
    public String getNameFromCustomFields() {
        return this.customFieldValues
                .stream()
                .filter(x -> x.getCustomField().getName().equals("name")
                        && x.getStatus().equals(EntityStatus.LIVE))
                .map(GroupCustomFieldValue::getValue)
                .findFirst()
                .orElse(this.customFieldValues
                        .stream()
                        .filter(x -> x.getCustomField().getName().equals("name")
                                && x.getStatus().equals(EntityStatus.PENDING))
                        .map(GroupCustomFieldValue::getValue)
                        .findFirst()
                        .orElse(""));
    }

}
