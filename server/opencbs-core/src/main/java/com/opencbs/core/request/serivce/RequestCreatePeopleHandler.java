package com.opencbs.core.request.serivce;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencbs.core.domain.json.ExtraJson;
import com.opencbs.core.domain.profiles.Person;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.PersonDto;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.mappers.PersonMapper;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import com.opencbs.core.request.interfaces.RequestHandler;
import com.opencbs.core.services.PersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@RequiredArgsConstructor
@Service
public class RequestCreatePeopleHandler implements RequestHandler {

    private final ObjectMapper mapper;
    private final PersonMapper personMapper;
    private final PersonService personService;

    @Override
    public RequestType getRequestType() {
        return RequestType.PEOPLE_CREATE;
    }

    @Override
    public ExtraJson getContent(BaseDto dto) throws IOException {
        PersonDto personDto = (PersonDto) dto;
        ExtraJson result = new ExtraJson();
        result.put("value", this.mapper.writeValueAsString(personDto));
        return result;
    }

    @Override
    public Long approveRequest(Request request) throws Exception {
        Person person = this.personService.create(this.createEntity(request), UserHelper.getCurrentUser(), true);
        return person.getId();
    }

    @Override
    public BaseRequestDto handleContent(Request request) throws IOException {
        return this.personMapper.mapEntityToDto(this.createEntity(request));
    }

    private Person createEntity(Request request) throws IOException {
        PersonDto personDto = this.mapper.readValue(request.getContent().get("value").toString(), PersonDto.class);
        return this.personMapper.mapDtoToEntity(personDto);
    }

    @Override
    public Class getTargetClass() {
        return Person.class;
    }
}
