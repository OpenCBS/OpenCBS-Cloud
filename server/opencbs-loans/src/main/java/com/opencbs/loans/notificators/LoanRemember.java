package com.opencbs.loans.notificators;

import com.opencbs.loans.domain.Loan;
import lombok.NonNull;

import java.time.LocalDate;
import java.util.HashMap;

public interface LoanRemember {
    LoanRememberType getType();
    HashMap getValues(@NonNull Loan loan, LocalDate date);
    String getTitle();
    Boolean isNeedSendReminder(Loan loan, LocalDate date);
}
