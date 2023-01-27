package com.opencbs.loans.domain.attachments;

import com.opencbs.core.domain.attachments.Attachment;
import com.opencbs.loans.domain.Loan;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Data
@Table(name = "loan_attachments")
public class LoanAttachment extends Attachment<Loan>{
}