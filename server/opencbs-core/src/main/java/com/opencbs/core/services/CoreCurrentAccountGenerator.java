package com.opencbs.core.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.accounting.services.AccountTagService;
import com.opencbs.core.annotations.CustomCurrentAccountGenerator;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.AccountType;
import com.opencbs.core.domain.profiles.Profile;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnMissingBean(annotation = CustomCurrentAccountGenerator.class)
public class CoreCurrentAccountGenerator extends CoreCurrentAccountGeneratorBase implements CurrentAccountGenerator {

    private final UserService userService;

    public CoreCurrentAccountGenerator(AccountTagService accountTagService,
                                       AccountService accountService,
                                       UserService userService) {
        super(accountTagService, accountService);
        this.userService = userService;
    }

    @Override
    public Account getCurrentAccount(Profile profile, Currency currency) {
        User currentUser = this.userService.getCurrentUser();
        Account accountGroup = this.getSubgroup(currency, currentUser);

        String number = "001001" + // TODO implement branch code and BIC logic.
                accountGroup.getNumber() +
                currency.getCode() +
                String.format("%06d", profile.getId());

        return this.accountService.create(this.getAccount(
                number,
                accountGroup,
                currency,
                currentUser,
                "Current account for client " + profile.getName(),
                AccountType.BALANCE));
    }
}
