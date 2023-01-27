package com.opencbs.borrowings.mappers;

import com.opencbs.borrowings.domain.BorrowingProduct;
import com.opencbs.borrowings.dto.BorrowingProductDetailsDto;
import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.services.CurrencyService;
import com.opencbs.borrowings.domain.BorrowingProductAccount;
import com.opencbs.borrowings.dto.BorrowingProductAccountDetailsDto;
import com.opencbs.borrowings.dto.BorrowingProductDto;
import org.modelmapper.ModelMapper;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Mapper
public class BorrowingProductMapper {

    private final CurrencyService currencyService;
    private final BorrowingProductAccountMapper borrowingProductAccountMapper;

    public BorrowingProductMapper(CurrencyService currencyService,
                                  BorrowingProductAccountMapper borrowingProductAccountMapper) {
        this.currencyService = currencyService;
        this.borrowingProductAccountMapper = borrowingProductAccountMapper;
    }

    public BorrowingProductDetailsDto mapToDto(BorrowingProduct borrowingProduct) {
        BorrowingProductDetailsDto result = new ModelMapper()
                .map(borrowingProduct, BorrowingProductDetailsDto.class);

        List<BorrowingProductAccountDetailsDto> accounts = borrowingProduct.getAccounts()
                .stream()
                .sorted(Comparator.comparing(BorrowingProductAccount::getBorrowingAccountRuleType))
                .map(this.borrowingProductAccountMapper::mapToDto)
                .collect(Collectors.toList());
        result.setAccounts(accounts);

        return result;
    }

    public BorrowingProduct mapToEntity(BorrowingProductDto borrowingProductDto) throws ResourceNotFoundException {

        BorrowingProduct map = new ModelMapper().map(borrowingProductDto, BorrowingProduct.class);

        Currency currency = this.currencyService
                .findOne(
                        borrowingProductDto
                                .getCurrencyId())
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                String.format("Currency not found (ID=%d)", borrowingProductDto.getCurrencyId())));
        map.setCurrency(currency);
        map.setAccounts(this.borrowingProductAccountMapper.mapToEntity(map, borrowingProductDto.getAccountList()));
        return map;
    }
}
