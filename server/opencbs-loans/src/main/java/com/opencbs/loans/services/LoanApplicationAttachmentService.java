package com.opencbs.loans.services;

import com.opencbs.core.configs.properties.AttachmentProperty;
import com.opencbs.core.helpers.FileProvider;
import com.opencbs.core.services.AttachmentService;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.attachments.LoanApplicationAttachment;
import com.opencbs.loans.repositories.LoanApplicationAttachmentRepository;
import org.springframework.stereotype.Service;

@Service
public class LoanApplicationAttachmentService extends AttachmentService<LoanApplication, LoanApplicationAttachment, LoanApplicationAttachmentRepository> {

    LoanApplicationAttachmentService(LoanApplicationAttachmentRepository repository,
                                     FileProvider fileProvider,
                                     AttachmentProperty attachmentProperty) {
        super(repository, fileProvider, attachmentProperty, LoanApplicationAttachment.class);
    }

    @Override
    protected String getSubfolder() {
        return "loan-applications";
    }
}
