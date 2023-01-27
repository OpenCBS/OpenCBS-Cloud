package com.opencbs.termdeposite.services;

import com.opencbs.termdeposite.domain.TermDeposit;

import javax.script.ScriptException;

public interface TermDepositCodeGenerator {

    String generateCode(TermDeposit termDeposit) throws ScriptException;
}
