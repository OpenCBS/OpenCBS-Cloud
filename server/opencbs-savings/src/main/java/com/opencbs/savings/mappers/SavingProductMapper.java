package com.opencbs.savings.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.enums.ProfileType;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.serivce.RequestService;
import com.opencbs.core.services.CurrencyService;
import com.opencbs.savings.domain.SavingProduct;
import com.opencbs.savings.dto.SavingProductDetailsDto;
import com.opencbs.savings.dto.SavingProductDto;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;

import java.util.ArrayList;
import java.util.List;

@Mapper
public class SavingProductMapper {

    private final CurrencyService currencyService;
    private final SavingProductAccountMapper savingProductAccountMapper;
    private final RequestService requestService;

    public SavingProductMapper(CurrencyService currencyService,
                               SavingProductAccountMapper savingProductAccountMapper,
                               RequestService requestService) {
        this.currencyService = currencyService;
        this.savingProductAccountMapper = savingProductAccountMapper;
        this.requestService = requestService;
    }

    public SavingProduct mapToEntity(SavingProductDto dto) {
        ModelMapper mapper = new ModelMapper();
        mapper.addMappings(new SavingProductMap());
        SavingProduct savingProduct = mapper.map(dto, SavingProduct.class);
        Currency currency = this.currencyService.findOne(dto.getCurrencyId()).get();
        savingProduct.setCurrency(currency);

        int availability = 0;
        ProfileType profileType;
        for (String profileTypeAsText : dto.getAvailability()) {
            profileType = ProfileType.fromString(profileTypeAsText);
            if (profileType != null) {
                availability = availability | profileType.getId();
            }
        }
        savingProduct.setAvailability(availability);
        savingProduct.setInterestAccrualFrequency(dto.getInterestAccrualFrequency());
        savingProduct.setPostingFrequency(dto.getPostingFrequency());
        savingProduct.setManagementFeeFrequency(dto.getManagementFeeFrequency());
        savingProduct.setAccounts(this.savingProductAccountMapper.mapToEntity(savingProduct, dto.getAccounts()));
        return savingProduct;
    }

    public SavingProductDetailsDto entityToDetailDto(SavingProduct savingProduct) {
        SavingProductDetailsDto detailsDto = new ModelMapper().map(savingProduct, SavingProductDetailsDto.class);
        detailsDto.setAvailability(buildAvailabity(savingProduct));
        detailsDto.setAccounts(this.savingProductAccountMapper.mapToDto(savingProduct.getAccounts()));
        detailsDto.setReadOnly(this.requestService.isActiveRequest(RequestType.SAVING_PRODUCT_EDIT, savingProduct.getId()));
        return detailsDto;
    }

    public SavingProductDto entityToDto(SavingProduct savingProduct){
        SavingProductDto dto = new ModelMapper().map(savingProduct, SavingProductDto.class);
        dto.setAvailability(buildAvailabity(savingProduct));
        return dto;
    }

    private List<String> buildAvailabity(SavingProduct savingProduct) {
        List<String> availability = new ArrayList<>();
        for (ProfileType profileType : ProfileType.values()) {
            if ((savingProduct.getAvailability() & profileType.getId()) > 0) {
                availability.add(profileType.toString());
            }
        }

        return availability;
    }

    private class SavingProductMap extends PropertyMap<SavingProductDto, SavingProduct> {
        protected void configure() {
            skip().setAvailability(0);
        }
    }

}
