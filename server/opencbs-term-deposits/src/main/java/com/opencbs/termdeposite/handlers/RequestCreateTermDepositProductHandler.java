package com.opencbs.termdeposite.handlers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencbs.core.domain.json.ExtraJson;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import com.opencbs.core.request.interfaces.RequestHandler;
import com.opencbs.termdeposite.domain.TermDepositProduct;
import com.opencbs.termdeposite.dto.TermDepositProductDto;
import com.opencbs.termdeposite.mapper.TermDepositProductMapper;
import com.opencbs.termdeposite.work.TermDepositProductWork;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class RequestCreateTermDepositProductHandler implements RequestHandler {

    private final ObjectMapper mapper;
    private final TermDepositProductWork termDepositProductWork;
    private final TermDepositProductMapper termDepositProductMapper;

    public RequestCreateTermDepositProductHandler(ObjectMapper mapper,
                                                  TermDepositProductWork termDepositProductWork,
                                                  TermDepositProductMapper termDepositProductMapper) {
        this.mapper = mapper;
        this.termDepositProductWork = termDepositProductWork;
        this.termDepositProductMapper = termDepositProductMapper;
    }

    @Override
    public RequestType getRequestType() {
        return RequestType.TERM_DEPOSIT_PRODUCT_CREATE;
    }

    @Override
    public ExtraJson getContent(BaseDto dto) throws IOException {
        TermDepositProductDto termDepositProductDto = (TermDepositProductDto) dto;
        ExtraJson result = new ExtraJson();
        result.put("value", this.mapper.writeValueAsString(termDepositProductDto));
        return result;
    }

    @Override
    public Long approveRequest(Request request) throws Exception {
        TermDepositProduct termDepositProduct = this.termDepositProductWork.create(this.createEntity(request));
        return termDepositProduct.getId();
    }

    @Override
    public BaseRequestDto handleContent(Request request) throws IOException {
        TermDepositProduct termDepositProduct = this.termDepositProductMapper.mapToEntity(this.createEntity(request));
        return this.termDepositProductMapper.entityToDto(termDepositProduct);
    }

    private TermDepositProductDto createEntity(Request request) throws IOException {
        return this.mapper.readValue(request.getContent().get("value").toString(), TermDepositProductDto.class);
    }

    @Override
    public Class getTargetClass() {
        return TermDepositProduct.class;
    }
}
