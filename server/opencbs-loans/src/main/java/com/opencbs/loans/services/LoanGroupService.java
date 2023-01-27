package com.opencbs.loans.services;

import com.opencbs.core.domain.profiles.Group;
import com.opencbs.core.listeners.GroupMemberListener;
import com.opencbs.loans.domain.GroupLoanApplication;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.enums.LoanApplicationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanGroupService implements GroupMemberListener {

    private final LoanApplicationService loanApplicationService;
    private final GroupLoanApplicationService groupLoanApplicationService;


    @Override
    public void onRemoveMember(Group group, Long memberId) {
        List<LoanApplication> loanApplicationList = this.loanApplicationService.findAllByProfile(group);

        for (LoanApplication application : loanApplicationList) {
            if (application.getStatus() != LoanApplicationStatus.DISBURSED) {
                GroupLoanApplication groupLoanApplication = this.groupLoanApplicationService.findAllByLoanApplication(application)
                        .stream()
                        .filter((x) -> x.getMember().getId().equals(memberId))
                        .findFirst()
                        .get();
                groupLoanApplication.setDeleted(true);
                this.groupLoanApplicationService.save(groupLoanApplication);
            }
        }
    }
}
