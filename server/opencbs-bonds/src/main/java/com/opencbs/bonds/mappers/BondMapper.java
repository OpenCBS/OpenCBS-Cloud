package com.opencbs.bonds.mappers;

import com.opencbs.bonds.domain.Bond;
import com.opencbs.bonds.domain.BondProduct;
import com.opencbs.bonds.dto.BondAmountDto;
import com.opencbs.bonds.dto.BondDetailsDto;
import com.opencbs.bonds.dto.BondDto;
import com.opencbs.bonds.dto.BondExpireDateDto;
import com.opencbs.bonds.services.BondService;
import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.CurrencyService;
import org.modelmapper.ModelMapper;

@Mapper
public class BondMapper {

    private final CurrencyService currencyService;
    private final BondService bondService;

    public BondMapper(CurrencyService currencyService,
                      BondService bondService) {
        this.currencyService = currencyService;
        this.bondService = bondService;
    }

    public BondDetailsDto mapToDto(Bond bond) {
        ModelMapper modelMapper = new ModelMapper();
        BondDetailsDto bondsDetailsDto = modelMapper.map(bond, BondDetailsDto.class);
        bondsDetailsDto.setEquivalentCurrency(bond.getCurrency());
        BondAmountDto amountDto = new BondAmountDto();
        amountDto.setAmount(bond.getAmount());
        amountDto.setEquivalentAmount(bond.getEquivalentAmount());
        bondsDetailsDto.setBondAmount(amountDto);
        bondsDetailsDto.setInterestToRefund(this.bondService.getInterestToRefund(bond));
        return bondsDetailsDto;
    }

    public Bond mapToEntity(BondDto dto) {
        ModelMapper modelMapper = new ModelMapper();
        Bond bond = modelMapper.map(dto, Bond.class);
        BondProduct product = this.bondService.findOneProduct(dto.getBondProductId()).get();
        Currency currency = this.currencyService.findOne(dto.getEquivalentCurrencyId()).get();
        BondAmountDto amountDto =
                this.bondService
                    .getBondAmount(Integer.valueOf(dto.getNumber().toString()), dto.getEquivalentCurrencyId(),
                            dto.getSellDate().atTime(DateHelper.getLocalTimeNow()));
        bond.setBondProduct(product);
        bond.setCurrency(currency);
        bond.setAmount(amountDto.getAmount());
        bond.setEquivalentAmount(amountDto.getEquivalentAmount());
        return bond;
    }

    public Bond mapToEntityExpireDate(BondExpireDateDto dto) {
        ModelMapper modelMapper = new ModelMapper();
        Bond bond = modelMapper.map(dto, Bond.class);
        return bond;
    }

    public Bond zip(Bond bond, BondDto bondDto) {
        Bond zippedBond = this.mapToEntity(bondDto);
        zippedBond.setCreatedAt(bond.getCreatedAt());
        zippedBond.setCreatedBy(bond.getCreatedBy());
        zippedBond.setStatus(bond.getStatus());
        return zippedBond;
    }
}
