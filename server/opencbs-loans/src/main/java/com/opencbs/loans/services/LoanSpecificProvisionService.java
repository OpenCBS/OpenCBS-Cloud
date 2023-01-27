package com.opencbs.loans.services;

import com.opencbs.core.helpers.DateHelper;
import com.opencbs.loans.domain.LoanInfo;
import com.opencbs.loans.domain.LoanProductProvision;
import com.opencbs.loans.domain.LoanSpecificProvision;
import com.opencbs.loans.domain.enums.ProvisionType;
import com.opencbs.loans.dto.SpecificProvisionInfoDto;
import com.opencbs.loans.repositories.LoanSpecificProvisionRepository;
import com.opencbs.loans.services.loancloseday.provisions.ProvisionProcessor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class LoanSpecificProvisionService {

    private final LoanService loanService;
    private final LoanSpecificProvisionRepository loanSpecificProvisionRepository;
    private final List<ProvisionProcessor> provisionProcessors;
    private final ProvisionService provisionService;


    public SpecificProvisionInfoDto getInfoSpecificProvision(@NonNull Long loanId, @NonNull ProvisionType provisionType) {
        final List<LoanProductProvision> provisions = this.loanService.getLoanById(loanId).getLoanApplication().getLoanProduct().getProvisions();
        LoanInfo loanInfo = this.loanService.getLoanInfo(loanId, DateHelper.getLocalDateNow());
        final ProvisionProcessor provisionProcessor = this.getProvisionProcessor(provisionType);
        final BigDecimal actualProvisionValue = provisionProcessor.getActualValueProvision(provisions, loanInfo);
        final BigDecimal reserve = provisionProcessor.calculate(provisions, loanInfo);

        final SpecificProvisionInfoDto.SpecificProvisionInfoDtoBuilder builder = SpecificProvisionInfoDto.builder();
        builder.reserve(reserve)
                .value(actualProvisionValue)
                .isSpecific(Boolean.FALSE);

        this.getSpecificProvision(loanId, provisionType)
                .ifPresent(loanSpecificProvision -> {
                    builder.isSpecific(Boolean.TRUE);
                    builder.isRate(loanSpecificProvision.getIsRate());
                    if (loanSpecificProvision.getIsRate()) {
                        builder.specificValue(loanSpecificProvision.getValue());
                        builder.specificReserve(this.calculateReserve(loanId, loanSpecificProvision.getValue(), provisionType));
                    } else {
                        builder.specificValue(this.calculatePercentByAmount(loanId, loanSpecificProvision.getValue(), provisionType));
                        builder.specificReserve(loanSpecificProvision.getValue());
                    }
                });

        return builder.build();
    }

    public BigDecimal calculateReserve(@NonNull Long loanId, @NonNull BigDecimal value, @NonNull ProvisionType provisionType) {
        final ProvisionProcessor provisionProcessor = this.getProvisionProcessor(provisionType);
        final List<LoanProductProvision> loanProductProvisions = Collections.singletonList(this.buildSpecificLoanProductProvision(value, provisionType));
        LoanInfo loanInfo = this.loanService.getLoanInfo(loanId, DateHelper.getLocalDateNow());
        return provisionProcessor.calculate(loanProductProvisions, loanInfo);
    }

    private LoanProductProvision buildSpecificLoanProductProvision(@NonNull BigDecimal value, @NonNull ProvisionType provisionType) {
        LoanProductProvision loanProductProvision = new LoanProductProvision();
        loanProductProvision.setLateOfDays(0L);
        switch (provisionType){
            case PRINCIPAL:
                loanProductProvision.setProvisionByPrincipal(value);
                break;
            case INTEREST:
                loanProductProvision.setProvisionByInterest(value);
                break;
            case PENALTIES:
                loanProductProvision.setProvisionByPenalty(value);
                break;
            default:
                    throw new IllegalArgumentException(String.format("Not found Type:%s  for generate specific provision", provisionType));
        }

        return loanProductProvision;
    }

    private Optional<LoanSpecificProvision> getSpecificProvision(Long loanId, ProvisionType provisionType) {
        LoanSpecificProvision probe = LoanSpecificProvision.builder()
                .loanId(loanId)
                .provisionType(provisionType)
                .build();
        return Optional.ofNullable(this.loanSpecificProvisionRepository.findOne(Example.of(probe)));
    }

    @Transactional
    public void applySpecificProvision(LoanSpecificProvision loanSpecificProvision) {
        if (loanSpecificProvision.getId()!=null && !loanSpecificProvision.getIsSpecific()){
            this.loanSpecificProvisionRepository.delete(loanSpecificProvision);
            return;
        }

        this.processingSpecificProvision(loanSpecificProvision);
    }

    private void processingSpecificProvision(LoanSpecificProvision loanSpecificProvision) {
        this.loanSpecificProvisionRepository.save(loanSpecificProvision);

        BigDecimal reserve = loanSpecificProvision.getValue();
        if (loanSpecificProvision.getIsRate()) {
            reserve = this.calculateReserve(loanSpecificProvision.getLoanId(), loanSpecificProvision.getValue(), loanSpecificProvision.getProvisionType());
        }

        this.provisionService.createReserve(loanSpecificProvision.getLoanId(), reserve, DateHelper.getLocalDateTimeNow(),
                this.getProvisionProcessor(loanSpecificProvision.getProvisionType()));
    }

    public BigDecimal calculatePercentByAmount(Long loanId, BigDecimal value, ProvisionType provisionType) {
        final ProvisionProcessor provisionProcessor = this.getProvisionProcessor(provisionType);
        LoanInfo loanInfo = this.loanService.getLoanInfo(loanId, DateHelper.getLocalDateNow());
        return provisionProcessor.calculateRateByAmount(loanInfo, value);
    }

    private ProvisionProcessor getProvisionProcessor(ProvisionType provisionType){
        for(ProvisionProcessor provisionProcessor: provisionProcessors){
            if (provisionType.equals(provisionProcessor.getType())){
                return provisionProcessor;
            }
        }

        throw new IllegalArgumentException(String.format("Not found provision processor for type %s", provisionType));
    }
}