package com.opencbs.bonds.workers;

import com.opencbs.bonds.domain.Bond;
import com.opencbs.bonds.domain.BondAccount;
import com.opencbs.bonds.domain.BondProductAccount;
import com.opencbs.bonds.domain.enums.BondAccountRuleType;
import com.opencbs.bonds.services.BondAccountService;
import com.opencbs.bonds.services.BondProductAccountService;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.domain.enums.AccountType;
import com.opencbs.core.services.GlobalSettingsService;
import com.opencbs.core.accounting.services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BondAccountWorker {

    private final BondProductAccountService bondProductAccountService;
    private final BondAccountService bondAccountService;
    private final AccountService accountService;
    private final GlobalSettingsService globalSettingsService;

    @Autowired
    public BondAccountWorker(BondProductAccountService bondProductAccountService,
                             BondAccountService bondAccountService,
                             AccountService accountService,
                             GlobalSettingsService globalSettingsService) {
        this.bondProductAccountService = bondProductAccountService;
        this.bondAccountService = bondAccountService;
        this.accountService = accountService;
        this.globalSettingsService = globalSettingsService;
    }

    public List<BondAccount> createBondAccounts(Bond bond){
        Currency pivotCurrency = this.globalSettingsService.getDefaultCurrency()
                .orElseThrow(() -> new RuntimeException("There is no pivot currency"));
        List<BondProductAccount> bondProductAccounts = this.bondProductAccountService.getAllBondProductAccounts(bond.getBondProduct());
        if(bondProductAccounts.size() != BondAccountRuleType.values().length){
            throw new RuntimeException("Accounts should be configured for the Bond Product");
        }

        List<BondAccount> bondAccounts = this.getAccountsFromBondProduct(bondProductAccounts, bond, pivotCurrency);
        for (BondAccount bondAccount : bondAccounts){
            if(this.checkIfExists(bondAccount)) {
                bondAccount = this.createAccount(bondAccount);
            }
            this.bondAccountService.create(bondAccount);
        }
        return bondAccounts;
    }

    private List<BondAccount> getAccountsFromBondProduct(List<BondProductAccount> bondProductAccounts, Bond bond, Currency currency){
        List<BondAccount> bondAccounts = new ArrayList<>();
        for (BondProductAccount bondProductAccount : bondProductAccounts){
            BondAccount bondAccount = new BondAccount();
            Account account = bondProductAccount.getAccount().toBuilder().build();

            if (account.getType() != AccountType.SUBGROUP && account.getType() != AccountType.BALANCE){
                throw new RuntimeException(String.format("Account %s should be SUBGROUP or BALANCE", account.getNumber()));
            }

            if (account.getType() == AccountType.SUBGROUP){
                account = this.accountService.getBalanceAccount(bondProductAccount.getAccount(),
                        account, bond.getId(), account.getName(), bond.getProfile().getName(), bond.getIsin());
            }
            account.setCurrency(currency);
            bondAccount.setAccount(account);
            bondAccount.setBond(bond);
            bondAccount.setBondAccountRuleType(bondProductAccount.getBondAccountRuleType());
            bondAccounts.add(bondAccount);
        }
        return bondAccounts;
    }

    private BondAccount createAccount(BondAccount bondAccount){
        Account account = this.accountService.create(bondAccount.getAccount());
        bondAccount.setAccount(account);
        return bondAccount;
    }

    private boolean checkIfExists(BondAccount bondAccount) {
        Account account = bondAccount.getAccount();
        if (account.getId() == null) {
            return true;
        }
        return false;
    }
}
