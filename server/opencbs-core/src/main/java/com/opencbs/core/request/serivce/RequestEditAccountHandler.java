package com.opencbs.core.request.serivce;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.dto.AccountCreateDto;
import com.opencbs.core.accounting.mappers.AccountMapper;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.domain.json.ExtraJson;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import com.opencbs.core.request.interfaces.RequestHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@RequiredArgsConstructor
@Service
public class RequestEditAccountHandler implements RequestHandler {

    private final ObjectMapper mapper;
    private final AccountMapper accountMapper;
    private final AccountService accountService;

    @Override
    public RequestType getRequestType() {
        return RequestType.ACCOUNT_EDIT;
    }

    @Override
    public ExtraJson getContent(BaseDto dto) throws IOException {
        AccountCreateDto accountCreateDto = (AccountCreateDto) dto;
        ExtraJson result = new ExtraJson();
        result.put("value", this.mapper.writeValueAsString(accountCreateDto));
        return result;
    }

    @Override
    public Long approveRequest(Request request) throws IOException {
        Account account = this.accountService.update(this.createEntity(request));
        return account.getId();
    }

    @Override
    public BaseRequestDto handleContent(Request request) throws IOException {
        return this.accountMapper.map(this.createEntity(request));
    }

    private Account createEntity(Request request) throws IOException {
        AccountCreateDto dto = this.mapper.readValue(request.getContent().get("value").toString(), AccountCreateDto.class);
        Account account = this.accountService.findOne(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Account not found(ID=%d).", dto.getId())));
        return this.accountMapper.zip(dto, account);
    }

    @Override
    public Class getTargetClass() {
        return Account.class;
    }
}
