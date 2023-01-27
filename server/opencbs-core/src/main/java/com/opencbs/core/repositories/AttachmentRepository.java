package com.opencbs.core.repositories;

import com.opencbs.core.domain.attachments.Attachment;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;

@NoRepositoryBean
public interface AttachmentRepository<T extends Attachment> extends Repository<T> {
    List<T> findByOwnerId(Long id);
}
