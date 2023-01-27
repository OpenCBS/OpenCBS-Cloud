package com.opencbs.core.services;

import com.opencbs.core.configs.properties.AttachmentProperty;
import com.opencbs.core.domain.attachments.CompanyAttachment;
import com.opencbs.core.domain.profiles.Company;
import com.opencbs.core.helpers.FileProvider;
import com.opencbs.core.repositories.CompanyAttachmentRepository;
import org.springframework.stereotype.Service;

@Service
public class CompanyAttachmentService extends AttachmentService<Company, CompanyAttachment, CompanyAttachmentRepository> {

    public CompanyAttachmentService(CompanyAttachmentRepository repository,
                                    FileProvider fileProvider,
                                    AttachmentProperty attachmentProperty) {
        super(repository, fileProvider, attachmentProperty, CompanyAttachment.class);
    }

    @Override
    protected String getSubfolder() {
        return "companies";
    }
}
