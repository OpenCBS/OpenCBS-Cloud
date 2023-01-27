package com.opencbs.loans.credit.lines.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.Penalty;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.services.PenaltyService;
import com.opencbs.core.services.ProfileService;
import com.opencbs.loans.credit.lines.domain.CreditLine;
import com.opencbs.loans.credit.lines.dto.CreditLineCreateDto;
import com.opencbs.loans.credit.lines.dto.CreditLineDto;
import com.opencbs.loans.credit.lines.dto.CreditLineInfoDto;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.LoanInfo;
import com.opencbs.loans.domain.enums.LoanApplicationStatus;
import com.opencbs.loans.domain.products.LoanProduct;
import com.opencbs.loans.services.LoanApplicationService;
import com.opencbs.loans.services.LoanProductService;
import com.opencbs.loans.services.LoanService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Mapper
@RequiredArgsConstructor
public class CreditLineMapper {

    private final LoanProductService loanProductService;
    private final PenaltyService penaltyService;
    private final ProfileService profileService;
    private final LoanApplicationService loanApplicationService;
    private final LoanService loanService;

    public CreditLineDto mapToDto(CreditLine creditLine) {
        CreditLineDto creditLineDto = new ModelMapper().map(creditLine, CreditLineDto.class);

        List<LoanApplication> loanApplications = this.loanApplicationService.getAllByCreditLine(creditLine)
                .stream()
                .filter(x -> x.getStatus().equals(LoanApplicationStatus.DISBURSED))
                .collect(Collectors.toList());
        List<Loan> loans = new ArrayList<>();
        BigDecimal olb = BigDecimal.ZERO;

        if (!loanApplications.isEmpty()) {
            for (LoanApplication loanApplication : loanApplications) {
                loans.add(this.loanService.getByLoanApplication(loanApplication));
            }

            for (Loan loan : loans) {
                LoanInfo loanInfo = this.loanService.getLoanInfo(loan.getId(), LocalDate.now());
                olb = olb.add(loanInfo.getOlb());
            }

            creditLineDto.setAvailableAmount(creditLine.getCommittedAmount().subtract(olb));
        }
        else {
            creditLineDto.setAvailableAmount(creditLine.getCommittedAmount());
        }

        return creditLineDto;
    }

    public CreditLineInfoDto mapInfoToDto(CreditLine creditLine) {
        return new ModelMapper().map(creditLine, CreditLineInfoDto.class);
    }

    public CreditLine mapDtoToEntity(CreditLineCreateDto creditLineCreateDto) {
        ModelMapper mapper = new ModelMapper();
        CreditLine creditLine = mapper.map(creditLineCreateDto, CreditLine.class);

        if (creditLineCreateDto.getProfileId() != null) {
            Optional<Profile> profile = this.profileService.getOne(creditLineCreateDto.getProfileId());
            profile.ifPresent(creditLine::setProfile);
        }

        if (creditLineCreateDto.getLoanProductId() != null) {
            Optional<LoanProduct> loanProduct = this.loanProductService.getOne(creditLineCreateDto.getLoanProductId());
            loanProduct.ifPresent(creditLine::setLoanProduct);
        }

        Set<Penalty> penalties = new HashSet<>(this.penaltyService.findAllByIds(creditLineCreateDto.getPenalties()));
        creditLine.setPenalties(penalties);

        return creditLine;
    }
}
