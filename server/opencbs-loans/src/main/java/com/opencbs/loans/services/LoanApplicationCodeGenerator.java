package com.opencbs.loans.services;

import com.opencbs.loans.domain.LoanApplication;

import javax.script.ScriptException;

public interface LoanApplicationCodeGenerator {

    String generateCode(LoanApplication loanApplication) throws ScriptException;
}
