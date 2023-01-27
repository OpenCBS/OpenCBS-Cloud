package com.opencbs.core.livechat.dtos.controllers;

import com.opencbs.core.livechat.dtos.MessageDto;
import com.opencbs.core.livechat.dtos.enums.ObjectType;
import com.opencbs.core.livechat.mappers.MessageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final MessageService messageService;
    private final MessageMapper messageMapper;


    @GetMapping(value = "/{objectType}/{objectId}")
    public Page<MessageDto> getAllComment(@PathVariable ObjectType objectType, @PathVariable Long objectId, Pageable pageable) {
        return this.messageService.getMessages(objectType, objectId, pageable).map(m->this.messageMapper.toMap(m));
    }

    @PostMapping(value = "/{objectType}/{objectId}")
    public Long createComment(@PathVariable ObjectType objectType, @PathVariable Long objectId, String payload) {
        return this.messageService.create(objectType, objectId, payload).getId();
    }
}
