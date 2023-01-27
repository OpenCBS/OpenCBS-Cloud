package com.opencbs.core.livechat.repositories;

import com.opencbs.core.livechat.dtos.domain.Message;
import com.opencbs.core.livechat.dtos.enums.ObjectType;
import com.opencbs.core.repositories.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MessageRepository extends Repository<Message> {

    Page<Message> findAllByObjectTypeAndObjectIdOrderByCreatedAt(ObjectType objectType, Long objectId, Pageable pageable);
}