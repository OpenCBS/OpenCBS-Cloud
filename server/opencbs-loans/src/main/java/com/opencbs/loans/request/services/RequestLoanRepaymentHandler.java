package com.opencbs.loans.request.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencbs.core.annotations.handlers.DefaultLoanRepaymentHandlerService;
import com.opencbs.core.domain.RepaymentSplit;
import com.opencbs.core.domain.json.ExtraJson;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import com.opencbs.core.request.interfaces.RequestHandler;
import com.opencbs.loans.workers.LoanRepaymentWorker;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@RequiredArgsConstructor
@Service
@DefaultLoanRepaymentHandlerService
public class RequestLoanRepaymentHandler implements RequestHandler {

    private final ObjectMapper mapper;
    private final LoanRepaymentWorker loanRepaymentWorker;


    @Override
    public RequestType getRequestType() {
        return RequestType.LOAN_REPAYMENT;
    }

    @Override
    public ExtraJson getContent(BaseDto dto) throws IOException {
        RepaymentSplit repaymentSplit = (RepaymentSplit) dto;
        ExtraJson result = new ExtraJson();
        result.put("value", this.mapper.writeValueAsString(repaymentSplit));
        return result;
    }

    @Override
    public Long approveRequest(Request request) throws Exception {
        RepaymentSplit repaymentSplit = this.mapper.readValue(request.getContent().get("value").toString(), RepaymentSplit.class);
        this.loanRepaymentWorker.makeRepayment(repaymentSplit);
        return repaymentSplit.getId();
    }

    @Override
    public BaseRequestDto handleContent(Request request) throws IOException {
        return this.mapper.readValue(request.getContent().get("value").toString(), RepaymentSplit.class);
    }

    @Override
    public Class getTargetClass() {
        return null;
    }
}
