package com.opencbs.loans.validators;

import com.opencbs.core.domain.profiles.Group;
import com.opencbs.core.domain.profiles.GroupMember;
import com.opencbs.core.exceptions.ApiException;
import com.opencbs.core.listeners.GroupValidatorListener;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.enums.LoanStatus;
import com.opencbs.loans.services.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.persistence.DiscriminatorValue;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanGroupValidator implements GroupValidatorListener {

    private final LoanService loanService;

    @Override
    public void onLeavingGroupValidation(Group group, GroupMember member){
        List<Loan> loans = this.loanService.findAllActiveByProfile(member.getMember());
        String groupTypeOfProfile = Group.class.getAnnotation(DiscriminatorValue.class).value();
        for(Loan loan : loans) {
            if(loan.getLoanApplication().getProfile().getType().equals(groupTypeOfProfile)
                    && loan.getProfile().getId().equals(member.getId())
                    && loan.getStatus() == LoanStatus.ACTIVE
                    && loan.getLoanApplication().getProfile().getId() == group.getId()) {
                throw new ApiException(HttpStatus.FORBIDDEN, "403",
                        String.format("Member with (ID = %d) have active loan in group with (ID = %d)", member.getId(), group.getId()));
            }
        }
    }
}
