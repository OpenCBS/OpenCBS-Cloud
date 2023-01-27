package com.opencbs.loans.services;

import com.opencbs.core.domain.profiles.Group;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.dto.group.FullGroupMemberAmountsDto;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.SimplifiedLoan;
import com.opencbs.loans.domain.enums.LoanApplicationStatus;
import com.opencbs.loans.domain.enums.LoanStatus;
import com.opencbs.loans.dto.LoanDto;
import com.opencbs.loans.mappers.LoanMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.DiscriminatorValue;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoanWorker {

    private final LoanApplicationService loanApplicationService;
    private final LoanService loanService;
    private final LoanMapper loanMapper;

    public LoanWorker(LoanApplicationService loanApplicationService,
                      LoanService loanService,
                      LoanMapper loanMapper) {
        this.loanApplicationService = loanApplicationService;
        this.loanService = loanService;
        this.loanMapper = loanMapper;
    }

    public Page<SimplifiedLoan> getAllLoans(String searchString, Pageable pageable) {
        return this.loanService.findAllLoans(searchString, pageable);
    }

    public Page<LoanDto> getByProfile(Pageable pageable, Profile profile) {
        String groupTypeOfProfile = Group.class.getAnnotation(DiscriminatorValue.class).value();
        List<LoanDto> loanDtoList = new ArrayList<>();
        List<LoanDto> result;
        List<LoanApplication> loanApplications = this.loanApplicationService.findAllByProfile(profile);

        for(LoanApplication application : loanApplications) {
            if(application.getProfile().getType().equals(groupTypeOfProfile)) {
                if (!application.getStatus().equals(LoanApplicationStatus.DISBURSED)) {
                    continue;
                }
                loanDtoList.add(this.getConsolidatedLoansByLoanApplication(application));
            }else {
                continue;
            }
        }

        List<Loan> personalLoans = this.loanService.findAllByProfile(profile);
        for (Loan loan : personalLoans){
            loanDtoList.add(this.loanMapper.mapToDtoWithSplitProfile(loan));
        }

        result = loanDtoList
                    .stream()
                    .filter(x -> !LoanStatus.PENDING.toString().equals(x.getStatus()))
                    .sorted(Comparator.comparing(LoanDto::getCreatedAt))
                    .collect(Collectors.toList());

        return new PageImpl<>(result, pageable, result.size());
    }


    public LoanDto getConsolidatedLoansByLoanApplication(LoanApplication application) {
        List<Loan> listOfGroupLoans = this.findAllLoanByApplication(application);
        return this.createGroupLoanDto(listOfGroupLoans, application);
    }

    private List<Loan> findAllLoanByApplication(LoanApplication application) {
        return this.loanService.findAllByLoanApplication(application);
    }

    private LoanDto createGroupLoanDto(List<Loan> listOfGroupLoans, LoanApplication application) {
        List<FullGroupMemberAmountsDto> members = new ArrayList();
        Loan groupLoan = this.getGroupLoan(listOfGroupLoans.get(0));

        BigDecimal groupAmount = BigDecimal.ZERO;

        for (Loan loan : listOfGroupLoans) {
            groupAmount = groupAmount.add(loan.getAmount());
            FullGroupMemberAmountsDto groupMembersDto = new FullGroupMemberAmountsDto();
            groupMembersDto.setName(loan.getProfile().getName());
            groupMembersDto.setAmount(loan.getAmount());
            groupMembersDto.setLoanId(loan.getId());
            groupMembersDto.setMemberId(loan.getProfile().getId());
            members.add(groupMembersDto);
        }

        groupLoan.setId(application.getId());
        groupLoan.setCode("");
        groupLoan.setProfile(application.getProfile());
        groupLoan.setAmount(groupAmount);
        return this.loanMapper.mapToDtoForGroup(groupLoan, members);
    }

    private Loan getGroupLoan(Loan loan) {
        Loan groupLoan = new Loan();
        groupLoan.setLoanOfficer(loan.getLoanOfficer());
        groupLoan.setLoanAccountList(loan.getLoanAccountList());
        groupLoan.setScheduleType(loan.getScheduleType());
        groupLoan.setMaturity(loan.getMaturity());
        groupLoan.setInterestRate(loan.getInterestRate());
        groupLoan.setGracePeriod(loan.getGracePeriod());
        groupLoan.setPreferredRepaymentDate(loan.getPreferredRepaymentDate());
        groupLoan.setDisbursementDate(loan.getDisbursementDate());
        groupLoan.setCreatedBy(loan.getCreatedBy());
        groupLoan.setCreatedAt(loan.getCreatedAt());
        groupLoan.setCurrencyId(loan.getCurrencyId());
        groupLoan.setStatus(loan.getStatus());
        groupLoan.setLoanApplication(loan.getLoanApplication());
        return groupLoan;
    }
}
