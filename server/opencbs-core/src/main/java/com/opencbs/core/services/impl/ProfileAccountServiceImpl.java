package com.opencbs.core.services.impl;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.domain.profiles.ProfileAccount;
import com.opencbs.core.repositories.ProfileAccountRepository;
import com.opencbs.core.services.ProfileAccountService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProfileAccountServiceImpl implements ProfileAccountService {

    private final ProfileAccountRepository repository;


    @Override
    public Account getProfileAccount(@NonNull Long profileId, @NonNull Long currencyId) {
        Optional<ProfileAccount> profileAccount = repository.findByProfileIdAndAccount_Currency_Id(profileId, currencyId);
        return profileAccount
                .map(ProfileAccount::getAccount)
                .orElseThrow(() -> new RuntimeException("Profile account not found by currency"));
    }
}
