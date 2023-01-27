package com.opencbs.loans.analytics.loan.services;

import com.opencbs.loans.analytics.loan.domain.Analytic;
import com.opencbs.loans.analytics.loan.repositories.AnalyticRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class AnalyticsService {

    private final AnalyticRepository analyticRepository;

    @Autowired
    public AnalyticsService(AnalyticRepository analyticRepository) {
        this.analyticRepository = analyticRepository;
    }

    public Analytic getAnalytic(Long loanId, LocalDateTime dateTime) {
        return this.analyticRepository.getAnalytic(loanId, dateTime);
    }

    public Analytic getCalculatedAnalytic(long loanId, LocalDate calculatedDate) {
        return this.analyticRepository.getFirstByLoanIdAndCalculatedDate(loanId, calculatedDate);
    }

    public Analytic save(Analytic analytic) {
        return this.analyticRepository.save(analytic);
    }

    public void deleteFutureAnalytics(LocalDate date, Long loanId) {
        this.analyticRepository.deleteFutureAnalytics(date, loanId);
    }
}
