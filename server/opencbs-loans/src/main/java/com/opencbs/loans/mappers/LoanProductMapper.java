package com.opencbs.loans.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.EntryFee;
import com.opencbs.core.domain.Penalty;
import com.opencbs.core.domain.enums.ProfileType;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.serivce.RequestService;
import com.opencbs.core.services.CurrencyService;
import com.opencbs.core.services.EntryFeeService;
import com.opencbs.core.services.PenaltyService;
import com.opencbs.loans.domain.LoanProductProvision;
import com.opencbs.loans.domain.products.LoanProduct;
import com.opencbs.loans.domain.products.LoanProductAccount;
import com.opencbs.loans.dto.products.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor

@Mapper
public class LoanProductMapper {

    private final CurrencyService currencyService;
    private final EntryFeeService entryFeeService;
    private final LoanProductAccountMapper loanProductAccountMapper;
    private final RequestService requestService;
    private final PenaltyService penaltyService;
    private final LoanProductionProvisionMapper loanProductionProvisionMapper;


    public LoanProductDetailsDto mapEntityToDto(LoanProduct loanProduct) {
        LoanProductDetailsDto loanProductDto = new ModelMapper().map(loanProduct, LoanProductDetailsDto.class);

        List<LoanProductAccountDetailsDto> allByLoanProductId = loanProduct.getAccounts()
                .stream()
                .sorted(Comparator.comparing(LoanProductAccount::getAccountRuleType))
                .map(this.loanProductAccountMapper::mapToDto)
                .collect(Collectors.toList());
        List<String> availability = new ArrayList<>();
        for (ProfileType profileType : ProfileType.values()) {
            if ((loanProduct.getAvailability() & profileType.getId()) > 0) {
                availability.add(profileType.toString());
            }
        }
        loanProductDto.setAvailability(availability);
        loanProductDto.setAccounts(allByLoanProductId);
        loanProductDto.setTopUpAllow(loanProduct.isTopUpAllow());
        loanProductDto.setTopUpMaxLimit(loanProduct.getTopUpMaxLimit());
        loanProductDto.setTopUpMaxOlb(loanProduct.getTopUpMaxOlb());
        loanProductDto.setReadOnly(this.requestService.isActiveRequest(RequestType.LOAN_PRODUCT_EDIT, loanProduct.getId()));
        loanProductDto.setScheduleBasedType(loanProduct.getScheduleBasedType());
        loanProductDto.setProvisioning(convertProvisions(loanProduct.getProvisions()));

        return loanProductDto;
    }

    public LoanProductLookupDto mapEntityToDtoLookup(LoanProduct loanProduct) {
        LoanProductLookupDto loanProductDto = new ModelMapper().map(loanProduct, LoanProductLookupDto.class);

        List<String> availability = new ArrayList<>();
        for (ProfileType profileType : ProfileType.values()) {
            if ((loanProduct.getAvailability() & profileType.getId()) > 0) {
                availability.add(profileType.toString());
            }
        }

        loanProductDto.setAvailability(availability);
        loanProductDto.setTopUpAllow(loanProduct.isTopUpAllow());
        loanProductDto.setTopUpMaxLimit(loanProduct.getTopUpMaxLimit());
        loanProductDto.setTopUpMaxOlb(loanProduct.getTopUpMaxOlb());
        loanProductDto.setReadOnly(this.requestService.isActiveRequest(RequestType.LOAN_PRODUCT_EDIT, loanProduct.getId()));
        loanProductDto.setScheduleBasedType(loanProduct.getScheduleBasedType());
        loanProductDto.setProvisioning(convertProvisions(loanProduct.getProvisions()));

        return loanProductDto;
    }

    private class LoanProductMap extends PropertyMap<LoanProductDto, LoanProduct> {
        protected void configure() {
            skip().setAvailability(0);
        }
    }

    public LoanProduct mapDtoToEntity(LoanProductDto loanProductDto) {
        ModelMapper mapper = new ModelMapper();
        mapper.addMappings(new LoanProductMap());
        LoanProduct loanProduct = mapper.map(loanProductDto, LoanProduct.class);
        if(loanProductDto.getCurrencyId() != null) {
            Optional<Currency> currency = this.currencyService.findOne(loanProductDto.getCurrencyId());
            currency.ifPresent(loanProduct::setCurrency);
        }

        int availability = 0;
        for (String profileTypeAsText : loanProductDto.getAvailability()) {
            ProfileType profileType = ProfileType.fromString(profileTypeAsText);
            if (profileType != null) {
                availability = availability | profileType.getId();
            }
        }
        loanProduct.setAvailability(availability);

        List<EntryFee> fees = this.entryFeeService.findAllByIds(loanProductDto.getFees());

        Set<Penalty> penalties = new HashSet<>(this.penaltyService.findAllByIds(loanProductDto.getPenalties()));

        loanProduct.setFees(fees);
        loanProduct.setPenalties(penalties);
        loanProduct.setAccounts(
                this.loanProductAccountMapper.mapToEntity(loanProduct, loanProductDto.getAccountList()));
        loanProduct.setScheduleBasedType(loanProductDto.getScheduleBasedType());

        final List<LoanProductProvision> loanProductProvisions = convertProvisionDtos(loanProductDto.getProvisioning());
        loanProductProvisions.forEach(lpp->lpp.setLoanProduct(loanProduct));
        loanProduct.setProvisions(loanProductProvisions);

        return loanProduct;
    }

    private List<LoanProductProvision> convertProvisionDtos(List<LoanProductProvisionDto> provisionDtos) {
        if (CollectionUtils.isEmpty(provisionDtos)) {
            return Collections.emptyList();
        }

        List<LoanProductProvision> loanProductProvisions = new ArrayList<>();
        provisionDtos.forEach(provisionDto ->
                loanProductProvisions.add(this.loanProductionProvisionMapper.mapToEntity(provisionDto)
        ));
        return loanProductProvisions;
    }

    private List<LoanProductProvisionDto> convertProvisions(List<LoanProductProvision> provisions) {
        if (CollectionUtils.isEmpty(provisions)) {
            return Collections.emptyList();
        }

        List<LoanProductProvisionDto> loanProductProvisionDtos = new ArrayList<>();
        provisions.forEach(provision ->
                loanProductProvisionDtos.add(this.loanProductionProvisionMapper.mapToDto(provision)
        ));
        return loanProductProvisionDtos;
    }
}
