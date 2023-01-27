package com.opencbs.loans.services;

import com.opencbs.core.domain.enums.EventType;
import com.opencbs.loans.domain.LoanEventInterestAccrual;

import java.time.LocalDateTime;
import java.util.List;

public interface LoanEventInterestAccrualService {

    LocalDateTime getDisbursementDate(Long loanId);

    List<LoanEventInterestAccrual> getEvents(Long loanId, EventType eventType, Integer installmentNumber);
}
