package com.opencbs.loans.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.dto.group.FullGroupMemberAmountsDto;
import com.opencbs.core.dto.profiles.ProfileDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.mappers.UserMapper;
import com.opencbs.core.request.serivce.RequestService;
import com.opencbs.core.services.UserService;
import com.opencbs.loans.domain.*;
import com.opencbs.loans.domain.enums.LoanStatus;
import com.opencbs.loans.domain.schedules.installments.LoanApplicationInstallment;
import com.opencbs.loans.dto.LoanDto;
import com.opencbs.loans.dto.SimplifiedLoanDto;
import com.opencbs.loans.services.LoanService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.context.ApplicationContext;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Mapper
@RequiredArgsConstructor
public class LoanMapper {

    private final UserService userService;
    private final ApplicationContext applicationContext;
    private final UserMapper userMapper;
    private final LoanService loanService;


    private class LoanApplicationToLoanMap extends PropertyMap<LoanApplication, Loan> {
        protected void configure() {
            skip().setLoanApplication(null);
            skip().setCreatedBy(null);
            skip().setCreatedAt(null);
            skip().setId(null);
        }
    }

    private class LoanApplicationInstallmentToLoanInstallmentMap extends PropertyMap<LoanApplicationInstallment, LoanInstallment> {
        protected void configure() {
            skip().setId(null);
        }
    }

    public Loan getLoanFromLoanApplicationForDisburse(LoanApplication loanApplication, User currentUser, BigDecimal amount) {
        ModelMapper mapper = new ModelMapper();
        mapper.addMappings(new LoanApplicationToLoanMap());
        mapper.addMappings(new LoanApplicationInstallmentToLoanInstallmentMap());

        Loan loan = mapper.map(loanApplication, Loan.class);
        User loanOfficer = this.userService.findById(loanApplication.getLoanOfficer().getId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan Officer not found (ID=%d).", loan.getCreatedBy().getId())));

        loan.setId(null);
        loan.setCreatedAt(DateHelper.getLocalDateTimeNow());
        loan.setCreatedBy(currentUser);
        loan.setLoanOfficer(loanOfficer);
        loan.setStatus(LoanStatus.ACTIVE);
        loan.setAmount(amount);
        loan.setLoanApplication(loanApplication);
        loan.setBranch(loanApplication.getBranch());

        return loan;
    }

    public LoanDto mapToDto(Loan loan) {
        ModelMapper mapper = new ModelMapper();
        User user = this.userService.findById(loan.getCreatedBy().getId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found (ID=%d).", loan.getCreatedBy().getId())));
        loan.setCreatedBy(user);

        User loanOfficer = this.userService.findById(loan.getLoanOfficer().getId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan Officer not found (ID=%d).", loan.getCreatedBy().getId())));
        loan.setLoanOfficer(loanOfficer);
        LoanDto loanDto = mapper.map(loan, LoanDto.class);
        loanDto.setLoanApplicationId(loan.getLoanApplication().getId());
        loanDto.setProfile(mapper.map(loan.getProfile(), ProfileDto.class));
        loanDto.setReadOnly(isLoanReadOnly(loan.getId()));
        return loanDto;
    }

    private Boolean isLoanReadOnly(Long loanId) {
        RequestService requestService = this.applicationContext.getBean(RequestService.class);
        if (requestService.isActiveRequestByModuleType(ModuleType.LOANS, loanId)) {
            return true;
        }

        return false;
    }

    public LoanDto mapToDtoWithSplitProfile(Loan loan) {
        ModelMapper mapper = new ModelMapper();
        LoanDto loanDto = mapper.map(loan, LoanDto.class);
        loanDto.setLoanApplicationId(loan.getLoanApplication().getId());
        loanDto.setProfile(mapper.map(loan.getLoanApplication().getProfile(), ProfileDto.class));
        return loanDto;
    }

    public LoanDto mapToDtoForGroup(Loan loan, List<FullGroupMemberAmountsDto> members) {
        ModelMapper mapper = new ModelMapper();
        LoanDto loanDto = mapper.map(loan, LoanDto.class);
        loanDto.setLoanApplicationId(loan.getLoanApplication().getId());
        loanDto.setProfile(mapper.map(loan.getProfile(), ProfileDto.class));
        loanDto.setMembers(members);
        return loanDto;
    }

    public LoanDto mapToDto(SimplifiedLoanBase loan) {
        ModelMapper mapper = new ModelMapper();
        return mapper.map(loan, LoanDto.class);
    }

    public SimplifiedLoanDto mapToDto(SimplifiedLoan simplifiedLoan) {
        ModelMapper mapper = new ModelMapper();
        final SimplifiedLoanDto simplifiedLoanDto = mapper.map(simplifiedLoan, SimplifiedLoanDto.class);
        simplifiedLoanDto.setLoanOfficer(this.userMapper.mapToBaseDto(this.userService.findById(simplifiedLoan.getLoanOfficerId()).get()));

        if(Objects.isNull(simplifiedLoanDto.getMaturityDate()) && (LoanStatus.ACTIVE.equals(simplifiedLoan.getStatus()) || LoanStatus.CLOSED.equals(simplifiedLoan.getStatus()))){
            final Optional<LoanInstallment> lastLoanInstallment = this.loanService.getInstallmentsByLoan(simplifiedLoan.getId(), null, false, false).stream()
                    .sorted(Comparator.comparing(LoanInstallment::getMaturityDate).reversed())
                    .findFirst();
            simplifiedLoanDto.setMaturityDate(lastLoanInstallment.get().getMaturityDate());
        }

        return simplifiedLoanDto;
    }
}
