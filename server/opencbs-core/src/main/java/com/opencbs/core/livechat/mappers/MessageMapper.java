package com.opencbs.core.livechat.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.livechat.dtos.MessageDto;
import com.opencbs.core.livechat.dtos.domain.Message;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;

@Mapper
@RequiredArgsConstructor
public class MessageMapper {

    public MessageDto toMap(Message message) {
        return new ModelMapper().map(message, MessageDto.class);
    }
}
