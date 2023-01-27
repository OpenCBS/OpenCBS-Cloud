package com.opencbs.core.domain.attachments;

import com.opencbs.core.domain.profiles.Group;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Audited
@Data
@Table(name = "groups_attachments")
public class GroupAttachment extends Attachment<Group> {
}
