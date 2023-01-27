package com.opencbs.loans.request.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencbs.core.domain.json.ExtraJson;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.RollbackParamDto;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import com.opencbs.core.request.interfaces.RequestHandler;
import com.opencbs.loans.workers.LoanRollBackWorker;
import com.opencbs.loans.workers.RollbackParams;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.LocalTime;

@RequiredArgsConstructor
@Service
public class RequestLoanRollbackHandler implements RequestHandler {

    private final ObjectMapper mapper;
    private final LoanRollBackWorker loanRollBackWorker;


    @Override
    public RequestType getRequestType() {
        return RequestType.LOAN_ROLLBACK;
    }

    @Override
    public ExtraJson getContent(BaseDto dto) throws IOException {
        RollbackParamDto rollbackParamDto = (RollbackParamDto) dto;
        ExtraJson result = new ExtraJson();
        result.put("value", this.mapper.writeValueAsString(rollbackParamDto));
        return result;
    }

    @Override
    public Long approveRequest(Request request) throws Exception {
        RollbackParamDto dto = this.mapper.readValue(request.getContent().get("value").toString(), RollbackParamDto.class);

        RollbackParams rollbackParams = RollbackParams.builder()
                .dateTime(LocalDateTime.of(dto.getDate(), LocalTime.of(6,0,0)))
                .comment(dto.getComment())
                .build();
        this.loanRollBackWorker.rollBack(rollbackParams, dto.getId());
        return dto.getId();
    }

    @Override
    public BaseRequestDto handleContent(Request request) throws IOException {
        RollbackParamDto dto = this.mapper.readValue(request.getContent().get("value").toString(), RollbackParamDto.class);
        BaseDto baseDto = new BaseDto();
        baseDto.setId(dto.getId());
        return baseDto;
    }

    @Override
    public Class getTargetClass() {
        return null;
    }
}
