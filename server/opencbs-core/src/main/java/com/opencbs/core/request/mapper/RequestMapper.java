package com.opencbs.core.request.mapper;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.dto.RequestDetailsDto;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import com.opencbs.core.request.serivce.RequestService;
import org.modelmapper.ModelMapper;

import java.io.IOException;

@Mapper
public class RequestMapper {

    private final RequestService requestService;

    public RequestMapper(RequestService requestService) {
        this.requestService = requestService;
    }

    public RequestDetailsDto mapEntityToDto(Request request) throws IOException {
        ModelMapper mapper = new ModelMapper();
        RequestDetailsDto dto = mapper.map(request, RequestDetailsDto.class);
        dto.setContent(this.requestService.getHandleContext(request.getType(),request));
        return dto;
    }

    public BaseRequestDto mapEntityToContent(Request request) throws IOException {
        return this.requestService.getHandleContext(request.getType(),request);
    }

}
