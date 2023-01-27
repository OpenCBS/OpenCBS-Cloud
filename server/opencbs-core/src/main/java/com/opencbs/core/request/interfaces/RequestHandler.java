package com.opencbs.core.request.interfaces;

import com.opencbs.core.domain.json.ExtraJson;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;

import java.io.IOException;

public interface RequestHandler {

    RequestType getRequestType();

    ExtraJson getContent(BaseDto dto) throws IOException;

    Long approveRequest(Request request) throws Exception;

    BaseRequestDto handleContent(Request request) throws IOException;

    Class getTargetClass();
}
