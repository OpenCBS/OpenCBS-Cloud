package com.opencbs.loans.services.loancloseday;

import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.loans.analytics.loan.domain.Analytic;
import com.opencbs.loans.analytics.loan.services.AnalyticsService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LoanAnalyticsDayClosureProcessor implements LoanDayClosureProcessor {

    private final AnalyticsService analyticsService;

    @Override
    public void processContract(@NonNull Long loanId, @NonNull LocalDate date, @NonNull User user) {
        LocalDateTime dateTime = date.atTime(getProcessType().getOperationTime());
        Analytic analytic = analyticsService.getAnalytic(loanId, dateTime);

        analyticsService.deleteFutureAnalytics(date, loanId);
        if (analytic == null) {
            return;
        }

        if (analytic.getCloseDate() != null && analytic.getCloseDate().toLocalDate().compareTo(dateTime.toLocalDate()) < 0) {
            return;
        }

        analyticsService.save(analytic);
    }

    @Override
    public ProcessType getProcessType() {
        return ProcessType.LOAN_ANALYTIC;
    }

    @Override
    public String getIdentityString() {
        return "loan.analytic";
    }
}
