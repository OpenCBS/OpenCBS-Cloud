package com.opencbs.loans.services.entryfeecalculation;

import com.opencbs.core.annotations.CustomEntryFeeCalculationService;
import com.opencbs.core.domain.EntryFee;
import com.opencbs.core.dto.DataForEntryFeeCalculationDto;
import com.opencbs.core.dto.EntryFeeDto;
import com.opencbs.core.services.entryfeecalculation.EntryFeeCalculationService;
import com.opencbs.loans.repositories.LoanProductRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@ConditionalOnMissingBean(annotation = CustomEntryFeeCalculationService.class)
public class DefaultEntryFeeCalculationService implements EntryFeeCalculationService {

    private final LoanProductRepository loanProductRepository;


    @Override
    public List<EntryFeeDto> calculate(@NonNull DataForEntryFeeCalculationDto dto) {
        return loanProductRepository.findOne(dto.getLoanProduct()).getFees()
                .stream()
                .map(x -> calculate(x, dto.getAmounts()))
                .collect(Collectors.toList());
    }

    private EntryFeeDto calculate(@NonNull EntryFee entryFee, @NonNull BigDecimal amount) {
        return entryFee.isPercentage()
                ? calculatePercentageEntryFee(entryFee, amount)
                : calculateFixedEntryFee(entryFee);
    }

    private EntryFeeDto calculateFixedEntryFee(@NonNull EntryFee entryFee) {
        return EntryFeeDto.builder()
                .id(entryFee.getId())
                .percentage(false)
                .amount(entryFee.getMinValue())
                .minLimit(entryFee.getMinLimit())
                .maxLimit(entryFee.getMaxLimit())
                .minValue(entryFee.getMinValue())
                .maxValue(entryFee.getMaxValue())
                .build();
    }

    private EntryFeeDto calculatePercentageEntryFee(@NonNull EntryFee entryFee, @NonNull BigDecimal amount) {
        BigDecimal minAmount = amount
                .multiply(entryFee.getMinValue())
                .divide(BigDecimal.valueOf(100));

        BigDecimal maxAmount = amount
                .multiply(entryFee.getMaxValue())
                .divide(BigDecimal.valueOf(100));


        return EntryFeeDto.builder()
                .id(entryFee.getId())
                .percentage(true)
                .amount(correctFeeAmount(minAmount, entryFee))
                .minLimit(entryFee.getMinLimit())
                .maxLimit(entryFee.getMaxLimit())
                .minValue(entryFee.getMinLimit() != null && minAmount.compareTo(entryFee.getMinLimit()) > 0
                        ? entryFee.getMinLimit()
                        : minAmount)
                .maxValue(entryFee.getMaxLimit() != null && maxAmount.compareTo(entryFee.getMaxLimit()) > 0
                        ? entryFee.getMaxLimit()
                        : maxAmount)
                .build();
    }

    private BigDecimal correctFeeAmount(@NonNull BigDecimal amount, @NonNull EntryFee entryFee) {
        if (entryFee.getMinLimit() != null && entryFee.getMinLimit().compareTo(amount) > 0) {
            return entryFee.getMinLimit();
        }

        if (entryFee.getMaxLimit() != null && entryFee.getMaxLimit().compareTo(amount) < 0) {
            return entryFee.getMaxLimit();
        }

        return amount;
    }
}