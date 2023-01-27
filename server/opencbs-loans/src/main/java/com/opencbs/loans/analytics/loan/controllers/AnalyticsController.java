package com.opencbs.loans.analytics.loan.controllers;

import com.opencbs.loans.analytics.loan.domain.Analytic;
import com.opencbs.loans.analytics.loan.services.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping(value = "/api/analytics")
@SuppressWarnings("unused")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @Autowired
    public AnalyticsController(AnalyticsService reportService) {
        this.analyticsService = reportService;
    }

    @RequestMapping(value = "/active-loans/{loanId}", method = RequestMethod.GET)
    public Analytic getAnalytic(@PathVariable long loanId,
                                @RequestParam(value = "dateTime")
                                @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime dateTime) throws Exception {
        return this.analyticsService.getAnalytic(loanId, dateTime);
    }
}
