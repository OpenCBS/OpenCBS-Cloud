package com.opencbs.bonds.services;

import com.opencbs.bonds.domain.BondAccount;
import com.opencbs.bonds.domain.enums.BondAccountRuleType;
import com.opencbs.bonds.repositories.BondAccountRepository;
import com.opencbs.core.accounting.domain.Account;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BondAccountService {

    private final BondAccountRepository bondAccountRepository;

    public BondAccountService(BondAccountRepository bondAccountRepository) {
        this.bondAccountRepository = bondAccountRepository;
    }

    public Account getAccount(List<BondAccount> accounts, BondAccountRuleType type) {
        BondAccount bondAccount = accounts
                .stream()
                .filter(x -> x.getBondAccountRuleType().equals(type))
                .findFirst()
                .orElseThrow(() -> new RuntimeException(String.format("Account is not found by bond rule(%s).", type.toString())));
        return bondAccount.getAccount();
    }

    @Transactional
    public List<BondAccount> create(List<BondAccount> bondAccounts){
        return bondAccounts.stream()
                .map(this::create)
                .collect(Collectors.toList());
    }

    @Transactional
    public BondAccount create(BondAccount bondAccount){
        return this.bondAccountRepository.save(bondAccount);
    }

    public List<BondAccount> getAllByBondId(Long bondId) {
        return this.bondAccountRepository.getAllByBondId(bondId);
    }
}
