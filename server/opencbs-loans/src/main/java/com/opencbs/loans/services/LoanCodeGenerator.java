package com.opencbs.loans.services;

import com.opencbs.loans.domain.Loan;

import javax.script.ScriptException;

public interface LoanCodeGenerator {

    String generateCode(Loan loan) throws ScriptException;
}
