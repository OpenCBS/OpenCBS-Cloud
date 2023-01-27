package com.opencbs.loans.dto;

import com.opencbs.core.domain.User;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanEvent;
import com.opencbs.loans.domain.LoanInstallment;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepaymentResult {

    private List<LoanInstallment> installments;
    private Set<Integer> affectedNumbers = new HashSet<>();
    private List<LoanEvent> events = new ArrayList<>();
    private Loan loan;
    private LocalDateTime timestamp;
    private User currentUser;


    public RepaymentResult(List<LoanInstallment> installments, Set<Integer> affectedNumbers, List<LoanEvent> events) {
        this.installments = installments;
        this.affectedNumbers = affectedNumbers;
        this.events = events;
    }

    public RepaymentResult addEvent(@NonNull LoanEvent event) {
        if (events == null) {
            events = new ArrayList<>();
        }

        events.add(event);
        return this;
    }

    public RepaymentResult addAffectedNumber(@NonNull Integer number) {
        if (affectedNumbers == null) {
            affectedNumbers = new HashSet<>();
        }

        affectedNumbers.add(number);
        return this;
    }
}
