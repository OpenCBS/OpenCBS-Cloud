package com.opencbs.loans.request.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencbs.core.domain.json.ExtraJson;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import com.opencbs.core.request.interfaces.RequestHandler;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.services.LoanApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@RequiredArgsConstructor
@Service
public class RequestLoanDisbursementHandler implements RequestHandler {

    private final ObjectMapper mapper;
    private final LoanApplicationService loanApplicationService;

    @Override
    public RequestType getRequestType() {
        return RequestType.LOAN_DISBURSEMENT;
    }

    @Override
    public ExtraJson getContent(BaseDto dto) throws IOException {
        ExtraJson result = new ExtraJson();
        result.put("value", this.mapper.writeValueAsString(dto));
        return result;
    }

    @Override
    public Long approveRequest(Request request) throws Exception {
        BaseDto dto = this.mapper.readValue(request.getContent().get("value").toString(), BaseDto.class);
        LoanApplication loanApplication = this.loanApplicationService.getLoanApplicationById(dto.getId());
        LoanApplication application = this.loanApplicationService.disburse(loanApplication, request.getCreatedBy());
        return application.getId();
    }

    @Override
    public BaseRequestDto handleContent(Request request) throws IOException {
        BaseDto dto = this.mapper.readValue(request.getContent().get("value").toString(), BaseDto.class);
        return dto;
    }

    @Override
    public Class getTargetClass() {
        return null;
    }
}
