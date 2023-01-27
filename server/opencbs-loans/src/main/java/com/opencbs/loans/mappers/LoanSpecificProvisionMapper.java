package com.opencbs.loans.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanSpecificProvision;
import com.opencbs.loans.domain.enums.ProvisionType;
import com.opencbs.loans.dto.SpecificProvisionApplyDto;
import com.opencbs.loans.repositories.LoanSpecificProvisionRepository;
import com.opencbs.loans.services.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.util.Assert;

import java.util.Optional;

@RequiredArgsConstructor
@Mapper
public class LoanSpecificProvisionMapper {

    private final LoanService loanService;
    private final LoanSpecificProvisionRepository loanSpecificProvisionRepository;

    public LoanSpecificProvision mapToEntity(SpecificProvisionApplyDto specificProvisionApplyDto) {
        Assert.notNull(specificProvisionApplyDto.getLoanId(), String.format("Field loanId can be set"));
        final Loan loan = this.loanService.getLoanById(specificProvisionApplyDto.getLoanId());
        Assert.notNull(loan, String.format("Loan with Id:%s not found", specificProvisionApplyDto.getLoanId()));

        final Optional<LoanSpecificProvision> existSpecificProvision =
                this.getExistSpecificProvision(specificProvisionApplyDto.getLoanId(), specificProvisionApplyDto.getProvisionType());

        LoanSpecificProvision loanSpecificProvision = existSpecificProvision
                .orElse(LoanSpecificProvision.builder()
                        .loanId(loan.getId())
                        .loan(loan)
                        .provisionType(specificProvisionApplyDto.getProvisionType())
                        .build()
                );
        loanSpecificProvision.setValue(specificProvisionApplyDto.getValue());
        loanSpecificProvision.setIsSpecific(specificProvisionApplyDto.getIsSpecific());
        loanSpecificProvision.setIsRate(specificProvisionApplyDto.getIsRate());

        return loanSpecificProvision;
    }

    private Optional<LoanSpecificProvision> getExistSpecificProvision(Long loanId, ProvisionType provisionType) {
        LoanSpecificProvision probe = LoanSpecificProvision.builder()
                .loanId(loanId)
                .provisionType(provisionType)
                .build();

        return Optional.ofNullable(this.loanSpecificProvisionRepository.findOne(Example.of(probe)));
    }
}
