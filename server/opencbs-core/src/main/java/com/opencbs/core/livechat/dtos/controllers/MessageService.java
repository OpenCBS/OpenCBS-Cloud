package com.opencbs.core.livechat.dtos.controllers;

import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.livechat.dtos.domain.Message;
import com.opencbs.core.livechat.dtos.enums.ObjectType;
import com.opencbs.core.livechat.repositories.MessageRepository;
import com.opencbs.core.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserService userService;


    public Page<Message> getMessages(ObjectType objectType, Long objectId, Pageable pageable) {
        return this.messageRepository.findAllByObjectTypeAndObjectIdOrderByCreatedAt(objectType, objectId, pageable);
    }

    public Message create(ObjectType objectType, Long objectId, String payload) {
        Message message = new Message();
        message.setCreatedAt(DateHelper.getLocalDateTimeNow());
        message.setPayload(payload);
        message.setUser(userService.getCurrentUser());
        message.setObjectType(objectType);
        message.setObjectId(objectId);
        return this.messageRepository.save(message);
    }
}
