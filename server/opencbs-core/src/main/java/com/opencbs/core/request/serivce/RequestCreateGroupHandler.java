package com.opencbs.core.request.serivce;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencbs.core.domain.json.ExtraJson;
import com.opencbs.core.domain.profiles.Group;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.group.GroupDto;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.mappers.GroupMapper;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import com.opencbs.core.request.interfaces.RequestHandler;
import com.opencbs.core.services.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@RequiredArgsConstructor
@Service
public class RequestCreateGroupHandler implements RequestHandler {

    private final ObjectMapper mapper;
    private final GroupMapper groupMapper;
    private final GroupService groupService;

    @Override
    public RequestType getRequestType() {
        return RequestType.GROUP_CREATE;
    }

    @Override
    public ExtraJson getContent(BaseDto dto) throws IOException {
        GroupDto groupDto = (GroupDto) dto;
        ExtraJson result = new ExtraJson();
        result.put("value", this.mapper.writeValueAsString(groupDto));
        return result;
    }

    @Override
    public Long approveRequest(Request request) throws Exception {
        Group group = this.groupService.create(this.createEntity(request), UserHelper.getCurrentUser(), false);
        return group.getId();
    }

    @Override
    public BaseRequestDto handleContent(Request request) throws IOException {
        return this.groupMapper.mapEntityToDto(this.createEntity(request));
    }

    private Group createEntity(Request request) throws IOException {
        GroupDto groupDto = this.mapper.readValue(request.getContent().get("value").toString(), GroupDto.class);
        return this.groupMapper.mapDtoToEntity(groupDto);
    }

    @Override
    public Class getTargetClass() {
        return Group.class;
    }
}
