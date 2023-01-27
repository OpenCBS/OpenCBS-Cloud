package com.opencbs.loans.domain.attachments;

import com.opencbs.core.domain.attachments.Attachment;
import com.opencbs.loans.domain.LoanApplication;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Data
@Table(name = "loan_applications_attachments")
public class LoanApplicationAttachment extends Attachment<LoanApplication> {
}
