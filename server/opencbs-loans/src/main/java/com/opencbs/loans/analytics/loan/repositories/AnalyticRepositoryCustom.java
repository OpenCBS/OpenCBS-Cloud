package com.opencbs.loans.analytics.loan.repositories;

import com.opencbs.loans.analytics.loan.domain.Analytic;

import java.time.LocalDateTime;

public interface AnalyticRepositoryCustom {

    Analytic getAnalytic(long loanId, LocalDateTime dateTime);
}
