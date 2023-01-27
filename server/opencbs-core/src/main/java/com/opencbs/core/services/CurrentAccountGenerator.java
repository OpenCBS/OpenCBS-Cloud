package com.opencbs.core.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.profiles.Profile;

public interface CurrentAccountGenerator {

    Account getCurrentAccount(Profile profile, Currency currency);
}