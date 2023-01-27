package com.opencbs.termdeposite.services;

import com.opencbs.termdeposite.domain.TermDeposit;

import java.time.LocalDate;

public interface TermDepositCloseInterface {

    TermDeposit close(Long termDepositId, LocalDate closeDate);
}
