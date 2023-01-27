package com.opencbs.core.services;

import com.opencbs.core.accounting.domain.Account;

public interface ProfileAccountService {

    Account getProfileAccount(Long profileId, Long currencyId);
}
