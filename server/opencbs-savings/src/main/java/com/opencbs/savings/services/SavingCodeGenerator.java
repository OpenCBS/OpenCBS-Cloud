package com.opencbs.savings.services;

import com.opencbs.savings.domain.Saving;

import javax.script.ScriptException;

public interface SavingCodeGenerator {

    String generateCode(Saving saving) throws ScriptException;
}
