package com.opencbs.core.services;

import com.opencbs.core.configs.properties.AttachmentProperty;
import com.opencbs.core.domain.attachments.GroupAttachment;
import com.opencbs.core.domain.profiles.Group;
import com.opencbs.core.helpers.FileProvider;
import com.opencbs.core.repositories.GroupAttachmentRepository;
import org.springframework.stereotype.Service;

@Service
public class GroupAttachmentService extends AttachmentService<Group, GroupAttachment, GroupAttachmentRepository> {

    public GroupAttachmentService(GroupAttachmentRepository groupAttachmentRepository,
                                  FileProvider fileProvider,
                                  AttachmentProperty attachmentProperty) {
        super(groupAttachmentRepository, fileProvider, attachmentProperty, GroupAttachment.class);
    }

    @Override
    protected String getSubfolder() {
        return "groups";
    }
}
