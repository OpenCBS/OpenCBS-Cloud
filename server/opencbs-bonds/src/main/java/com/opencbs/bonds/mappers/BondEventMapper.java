package com.opencbs.bonds.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.BaseEvent;
import com.opencbs.core.domain.User;
import com.opencbs.core.dto.EventDto;
import com.opencbs.core.dto.UserInfoDto;
import com.opencbs.core.services.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper
public class BondEventMapper {
    private final UserService userService;
    private final ModelMapper modelMapper = new ModelMapper();

    @Autowired
    public BondEventMapper(UserService userService) {
        this.userService = userService;
    }

    public EventDto mapToDto(BaseEvent event) {
        EventDto dto = this.modelMapper.map(event, EventDto.class);
        User createdBy = this.userService.findById(event.getCreatedById()).orElse(null);
        dto.setCreatedBy(this.modelMapper.map(createdBy, UserInfoDto.class));
        dto.setComment(event.getComment());
        dto.setGroupKey(event.getGroupKey());
        return dto;
    }
}
