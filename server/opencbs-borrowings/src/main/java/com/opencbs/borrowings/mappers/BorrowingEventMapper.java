package com.opencbs.borrowings.mappers;

import com.opencbs.borrowings.dto.BorrowingEventDto;
import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.BaseEvent;
import com.opencbs.core.domain.User;
import com.opencbs.core.dto.UserInfoDto;
import com.opencbs.core.services.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper
public class BorrowingEventMapper {
    private final UserService userService;
    private final ModelMapper modelMapper = new ModelMapper();

    @Autowired
    public BorrowingEventMapper(UserService userService) {
        this.userService = userService;
    }

    public BorrowingEventDto mapToDto(BaseEvent borrowingEvent) {
        BorrowingEventDto dto = this.modelMapper.map(borrowingEvent, BorrowingEventDto.class);
        User createdBy = this.userService.findById(borrowingEvent.getCreatedById()).orElse(null);
        dto.setCreatedBy(this.modelMapper.map(createdBy, UserInfoDto.class));
        dto.setComment(borrowingEvent.getComment());
        dto.setGroupKey(borrowingEvent.getGroupKey());
        return dto;
    }
}
