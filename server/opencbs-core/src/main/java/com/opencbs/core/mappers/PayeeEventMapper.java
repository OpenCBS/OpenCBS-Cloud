package com.opencbs.core.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.PayeeEvent;
import com.opencbs.core.domain.User;
import com.opencbs.core.dto.PayeeEventDto;
import com.opencbs.core.dto.UserInfoDto;
import com.opencbs.core.services.UserService;
import org.modelmapper.ModelMapper;

@Mapper
public class PayeeEventMapper {

    private final UserService userService;
    private final ModelMapper modelMapper = new ModelMapper();

    public PayeeEventMapper(UserService userService) {
        this.userService = userService;
    }

    public PayeeEventDto mapToDto(PayeeEvent payeeEvent){
        PayeeEventDto dto = this.modelMapper.map(payeeEvent, PayeeEventDto.class);
        User createdBy = this.userService.findById(payeeEvent.getCreatedBy().getId()).get();
        dto.setCreatedBy(this.modelMapper.map(createdBy, UserInfoDto.class));
        return dto;
    }
}
