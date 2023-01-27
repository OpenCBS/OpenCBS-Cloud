package com.opencbs.core.mappers;

import com.opencbs.core.workers.LookupWorker;
import org.modelmapper.ModelMapper;

public abstract class ProfileBaseMapper {

    protected final AttachmentMapper attachmentMapper;
    protected final ModelMapper modelMapper = new ModelMapper();
    protected final LookupWorker lookupWorker;

    protected ProfileBaseMapper(AttachmentMapper attachmentMapper,
                                LookupWorker lookupWorker) {
        this.attachmentMapper = attachmentMapper;
        this.lookupWorker = lookupWorker;
    }
}
