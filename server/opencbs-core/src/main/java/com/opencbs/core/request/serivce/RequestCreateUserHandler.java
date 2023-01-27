package com.opencbs.core.request.serivce;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.json.ExtraJson;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.UserDto;
import com.opencbs.core.mappers.UserMapper;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import com.opencbs.core.request.interfaces.RequestHandler;
import com.opencbs.core.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@RequiredArgsConstructor
@Service
public class RequestCreateUserHandler implements RequestHandler {

    private final ObjectMapper mapper;
    private final UserMapper userMapper;
    private final UserService userService;

    @Override
    public RequestType getRequestType() {
        return RequestType.USER_CREATE;
    }

    @Override
    public ExtraJson getContent(BaseDto dto) throws IOException {
        UserDto userDto = (UserDto) dto;
        ExtraJson result = new ExtraJson();
        result.put("value", this.mapper.writeValueAsString(userDto));
        return result;
    }

    @Override
    public Long approveRequest(Request request) throws IOException {
        User user = this.userService.save(this.createEntity(request));
        return user.getId();
    }

    @Override
    public BaseRequestDto handleContent(Request request) throws IOException {
        return this.userMapper.mapToDto(this.createEntity(request));
    }

    private User createEntity(Request request) throws IOException {
        UserDto dto = this.mapper.readValue(request.getContent().get("value").toString(), UserDto.class);
        User user = this.userMapper.map(dto);
        user.setFirstLogin(true);
        return user;
    }

    @Override
    public Class getTargetClass() {
        return User.class;
    }
}
