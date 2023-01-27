package com.opencbs.loans.services;

import com.opencbs.core.domain.profiles.Group;
import com.opencbs.loans.domain.GroupLoanApplication;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.repositories.GroupLoanApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupLoanApplicationService {

    private final GroupLoanApplicationRepository groupLoanApplicationRepository;

    @Autowired
    public GroupLoanApplicationService(GroupLoanApplicationRepository groupLoanApplicationRepository) {
        this.groupLoanApplicationRepository = groupLoanApplicationRepository;
    }

    public GroupLoanApplication save(GroupLoanApplication groupLoanApplication) {
        return this.groupLoanApplicationRepository.save(groupLoanApplication);
    }

    public List<GroupLoanApplication> findAllByLoanApplication(LoanApplication loanApplication) {
        return this.groupLoanApplicationRepository.findAllByLoanApplicationAndDeletedFalse(loanApplication);
    }

    public List<GroupLoanApplication> findAllByGroup(Group group) {
        return this.groupLoanApplicationRepository.findAllByGroupAndDeletedFalse(group);
    }
}
