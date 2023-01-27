package com.opencbs.core.domain.attachments;

import com.opencbs.core.domain.profiles.Person;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Audited
@Table(name = "people_attachments")
@Data
public class PersonAttachment extends Attachment<Person> {
}
