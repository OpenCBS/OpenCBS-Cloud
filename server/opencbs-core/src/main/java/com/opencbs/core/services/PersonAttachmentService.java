package com.opencbs.core.services;

import com.opencbs.core.configs.properties.AttachmentProperty;
import com.opencbs.core.domain.attachments.PersonAttachment;
import com.opencbs.core.domain.profiles.Person;
import com.opencbs.core.helpers.FileProvider;
import com.opencbs.core.repositories.PersonAttachmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PersonAttachmentService extends AttachmentService<Person, PersonAttachment, PersonAttachmentRepository> {

    @Autowired
    public PersonAttachmentService(PersonAttachmentRepository repository,
                                   FileProvider fileProvider,
                                   AttachmentProperty attachmentProperty) {
        super(repository, fileProvider, attachmentProperty, PersonAttachment.class);
    }

    @Override
    protected String getSubfolder() {
        return "people";
    }
}
