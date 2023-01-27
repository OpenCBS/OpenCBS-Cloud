package com.opencbs.termdeposite.mapper;

import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.enums.ProfileType;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.serivce.RequestService;
import com.opencbs.core.services.CurrencyService;
import com.opencbs.termdeposite.domain.TermDepositProduct;
import com.opencbs.termdeposite.dto.TermDepositProductAccountDetailsDto;
import com.opencbs.termdeposite.dto.TermDepositProductDetailsDto;
import com.opencbs.termdeposite.dto.TermDepositProductDto;
import com.opencbs.termdeposite.dto.TermDepositProductSimplifiedDto;
import lombok.NonNull;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TermDepositProductMapper {

    private final CurrencyService currencyService;
    private final TermDepositProductAccountMapper termDepositProductAccountMapper;
    private final RequestService requestService;

    @Autowired
    public TermDepositProductMapper(@NonNull CurrencyService currencyService,
                                    @NonNull TermDepositProductAccountMapper termDepositProductAccountMapper,
                                    RequestService requestService) {
        this.currencyService = currencyService;
        this.termDepositProductAccountMapper = termDepositProductAccountMapper;
        this.requestService = requestService;
    }

    public TermDepositProductDetailsDto entityToDto(TermDepositProduct termDepositProduct) {
        TermDepositProductDetailsDto detailsDto = new ModelMapper().map(termDepositProduct, TermDepositProductDetailsDto.class);
        List<String> availability = new ArrayList<>();
        for (ProfileType profileType : ProfileType.values()) {
            if ((termDepositProduct.getAvailability() & profileType.getId()) > 0) {
                availability.add(profileType.toString());
            }
        }
        detailsDto.setAvailability(availability);
        List<TermDepositProductAccountDetailsDto> accounts = termDepositProduct.getTermDepositAccountList()
                .stream()
                .map(this.termDepositProductAccountMapper::mapToDto)
                .collect(Collectors.toList());
        detailsDto.setAccounts(accounts);
        detailsDto.setReadOnly(this.requestService.isActiveRequest(RequestType.TERM_DEPOSIT_PRODUCT_EDIT, termDepositProduct.getId()));
        return detailsDto;
    }

    public TermDepositProduct mapToEntity(TermDepositProductDto dto) {
        ModelMapper mapper = new ModelMapper();
        mapper.addMappings(new TermDepositProductMap());
        TermDepositProduct termProduct = mapper.map(dto, TermDepositProduct.class);
        Currency currency = this.currencyService.findOne(dto.getCurrencyId()).get();
        termProduct.setCurrency(currency);

        int availability = 0;
        ProfileType profileType;
        for (String profileTypeAsText : dto.getAvailability()) {
            profileType = ProfileType.fromString(profileTypeAsText);
            if (profileType != null) {
                availability = availability | profileType.getId();
            }
        }
        termProduct.setAvailability(availability);
        termProduct.setTermDepositAccountList(this.termDepositProductAccountMapper.mapToEntity(termProduct, dto.getAccountList()));
        return termProduct;
    }

    private class TermDepositProductMap extends PropertyMap<TermDepositProductDto, TermDepositProduct> {
        protected void configure() {
            skip().setAvailability(0);
        }
    }

    public TermDepositProductSimplifiedDto entityToSimplifiedDto(TermDepositProduct termDepositProduct){
        ModelMapper mapper = new ModelMapper();
        TermDepositProductSimplifiedDto termDepositProductSimplifiedDto = mapper.map(termDepositProduct, TermDepositProductSimplifiedDto.class);

        return termDepositProductSimplifiedDto;
    }

}
