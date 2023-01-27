package com.opencbs.core.domain.attachments;

import com.opencbs.core.domain.profiles.Company;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Table(name = "companies_attachments")
public class CompanyAttachment extends Attachment<Company> {

}
