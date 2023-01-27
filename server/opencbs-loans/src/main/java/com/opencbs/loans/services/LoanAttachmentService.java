package com.opencbs.loans.services;

import com.opencbs.core.configs.properties.AttachmentProperty;
import com.opencbs.core.helpers.FileProvider;
import com.opencbs.core.services.AttachmentService;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.attachments.LoanAttachment;
import com.opencbs.loans.repositories.LoanAttachmentRepository;
import org.springframework.stereotype.Service;

@Service
public class LoanAttachmentService extends AttachmentService<Loan, LoanAttachment, LoanAttachmentRepository> {

    LoanAttachmentService(LoanAttachmentRepository repository,
                          FileProvider fileProvider,
                          AttachmentProperty attachmentProperty){
        super(repository, fileProvider, attachmentProperty, LoanAttachment.class);
    }

    @Override
    protected String getSubfolder() {return "loan";}

}