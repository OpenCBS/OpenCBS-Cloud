package com.opencbs.savings.services.impl;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.savings.domain.SavingAccountSimple;
import com.opencbs.savings.domain.enums.SavingAccountRuleType;
import com.opencbs.savings.repositories.SavingAccountRepository;
import com.opencbs.savings.services.SavingAccountService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SavingAccountServiceImpl implements SavingAccountService {

    private final SavingAccountRepository savingAccountRepository;


    @Override
    public Account getSavingAccount(@NonNull Long savingId, @NonNull SavingAccountRuleType type) {
        Optional<SavingAccountSimple> savingAccount = savingAccountRepository.findBySavingIdAndType(savingId, type);
        if (savingAccount.isPresent()) {
            return savingAccount.get().getAccount();
        }

        throw new RuntimeException(String.format("Account is not found by saving rule(%s).", type.toString()));
    }
}
