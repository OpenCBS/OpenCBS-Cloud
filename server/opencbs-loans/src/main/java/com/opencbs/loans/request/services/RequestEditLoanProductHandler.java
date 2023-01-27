package com.opencbs.loans.request.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencbs.core.domain.json.ExtraJson;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import com.opencbs.core.request.interfaces.RequestHandler;
import com.opencbs.loans.domain.products.LoanProduct;
import com.opencbs.loans.dto.products.LoanProductDto;
import com.opencbs.loans.mappers.LoanProductMapper;
import com.opencbs.loans.services.LoanProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@RequiredArgsConstructor
@Service
public class RequestEditLoanProductHandler implements RequestHandler {

    private final ObjectMapper mapper;
    private final LoanProductService loanProductService;
    private final LoanProductMapper loanProductMapper;

    @Override
    public RequestType getRequestType() {
        return RequestType.LOAN_PRODUCT_EDIT;
    }

    @Override
    public ExtraJson getContent(BaseDto dto) throws IOException {
        LoanProductDto loanProductDto = (LoanProductDto) dto;
        ExtraJson result = new ExtraJson();
        result.put("value", this.mapper.writeValueAsString(loanProductDto));
        return result;
    }

    @Override
    public Long approveRequest(Request request) throws IOException {
        LoanProduct loanProduct = this.loanProductService.update(this.createEntity(request));
        return loanProduct.getId();
    }

    @Override
    public BaseRequestDto handleContent(Request request) throws IOException {
        return this.loanProductMapper.mapEntityToDto(this.createEntity(request));
    }

    private LoanProduct createEntity(Request request) throws IOException {
        LoanProductDto loanProductDto = this.mapper.readValue(request.getContent().get("value").toString(), LoanProductDto.class);
        return this.loanProductMapper.mapDtoToEntity(loanProductDto);
    }

    @Override
    public Class getTargetClass() {
        return LoanProduct.class;
    }
}
