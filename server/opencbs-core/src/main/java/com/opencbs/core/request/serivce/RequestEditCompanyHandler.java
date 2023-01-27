package com.opencbs.core.request.serivce;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencbs.core.domain.json.ExtraJson;
import com.opencbs.core.domain.profiles.Company;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.CompanyDto;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.mappers.CompanyMapper;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import com.opencbs.core.request.interfaces.RequestHandler;
import com.opencbs.core.services.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@RequiredArgsConstructor
@Service
public class RequestEditCompanyHandler implements RequestHandler {

    private final ObjectMapper mapper;
    private final CompanyMapper companyMapper;
    private final CompanyService companyService;

    @Override
    public RequestType getRequestType() {
        return RequestType.COMPANY_EDIT;
    }

    @Override
    public ExtraJson getContent(BaseDto dto) throws IOException {
        CompanyDto companyDto = (CompanyDto) dto;
        ExtraJson result = new ExtraJson();
        result.put("value", this.mapper.writeValueAsString(companyDto));
        return result;
    }

    @Override
    public Long approveRequest(Request request) throws Exception {
        CompanyDto companyDto = this.mapper.readValue(request.getContent().get("value").toString(), CompanyDto.class);
        Company company = this.companyService.getCompany(companyDto.getId());
        Company updatedCompany = this.companyService.update(this.companyMapper.zip(company, companyDto), UserHelper.getCurrentUser());
        return updatedCompany.getId();
    }

    @Override
    public BaseRequestDto handleContent(Request request) throws IOException {
        return this.companyMapper.mapEntityToDto(this.createEntity(request));
    }

    private Company createEntity(Request request) throws IOException {
        CompanyDto companyDto = this.mapper.readValue(request.getContent().get("value").toString(), CompanyDto.class);
        return this.companyMapper.mapDtoToEntity(companyDto);
    }

    @Override
    public Class getTargetClass() {
        return Company.class;
    }
}
