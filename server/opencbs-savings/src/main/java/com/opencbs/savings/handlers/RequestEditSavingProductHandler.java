package com.opencbs.savings.handlers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencbs.core.domain.json.ExtraJson;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import com.opencbs.core.request.interfaces.RequestHandler;
import com.opencbs.savings.domain.SavingProduct;
import com.opencbs.savings.dto.SavingProductDto;
import com.opencbs.savings.mappers.SavingProductMapper;
import com.opencbs.savings.services.SavingProductService;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class RequestEditSavingProductHandler implements RequestHandler {

    private final ObjectMapper mapper;
    private final SavingProductMapper savingProductMapper;
    private final SavingProductService savingProductService;

    public RequestEditSavingProductHandler(ObjectMapper mapper,
                                           SavingProductMapper savingProductMapper,
                                           SavingProductService savingProductService) {
        this.mapper = mapper;
        this.savingProductMapper = savingProductMapper;
        this.savingProductService = savingProductService;
    }

    @Override
    public RequestType getRequestType() {
        return RequestType.SAVING_PRODUCT_EDIT;
    }

    @Override
    public ExtraJson getContent(BaseDto dto) throws IOException {
        SavingProductDto savingProductDto = (SavingProductDto) dto;
        ExtraJson result = new ExtraJson();
        result.put("value", this.mapper.writeValueAsString(savingProductDto));
        return result;
    }

    @Override
    public Long approveRequest(Request request) throws IOException {
        SavingProduct savingProduct = this.savingProductService.update(this.createEntity(request));
        return savingProduct.getId();
    }

    @Override
    public BaseRequestDto handleContent(Request request) throws IOException {
        return this.savingProductMapper.entityToDetailDto(this.createEntity(request));
    }

    @Override
    public Class getTargetClass() {
        return SavingProduct.class;
    }

    private SavingProduct createEntity(Request request) throws IOException {
        SavingProductDto savingProductDto = this.mapper.readValue(request.getContent().get("value").toString(), SavingProductDto.class);
        return this.savingProductMapper.mapToEntity(savingProductDto);
    }
}
