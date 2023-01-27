package com.opencbs.core.accounting.mappers;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.dto.AccountCreateDto;
import com.opencbs.core.accounting.dto.AccountDetailsDto;
import com.opencbs.core.accounting.dto.AccountDto;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.dto.SimplifiedProfileAccount;
import com.opencbs.core.dto.profiles.ProfileAccountDto;
import com.opencbs.core.services.CurrencyService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper
public class AccountMapper {

    private final AccountService accountService;
    private final CurrencyService currencyService;

    @Autowired
    public AccountMapper(AccountService accountService, CurrencyService currencyService) {
        this.accountService = accountService;
        this.currencyService = currencyService;
    }

    public AccountDto mapToDto(Account account) {
        return new ModelMapper().map(account, AccountDto.class);
    }

    public AccountDetailsDto mapToDetailsDto(Account account) {
        AccountDetailsDto dto = this.mapToDetails(account);
        dto.setNumber(account.getNumber());
        return dto;
    }

    public AccountDto mapToDetailsForEdit(Account account) {
        AccountDto dto = this.mapToDetails(account);
        if(account.getParent() != null){
            dto.setNumber(account.getNumber().substring(account.getParent().getNumber().length()));
        }
        return dto;
    }

    private AccountDetailsDto mapToDetails(Account account) {
        AccountDetailsDto dto = new ModelMapper().map(account, AccountDetailsDto.class);
        dto.setHasTransactions(this.accountService.hasTransactions(account.getId()));
        dto.setIsDebit(account.getIsDebit());
        if(account.getParent() != null){
            dto.setParentAccountNumber(account.getParent().getNumber());
        }
        return dto;
    }

    public ProfileAccountDto accountToProfileDto(Account account) {
        return new ModelMapper().map(account, ProfileAccountDto.class);
    }

    public ProfileAccountDto map(Account account) {
        ProfileAccountDto dto = this.accountToProfileDto(account);
        if (account.getParent() != null) {
            dto.setParentAccountNumber(account.getParent().getNumber());
        }
        dto.setNumber(account.getNumber());
        return dto;
    }

    public SimplifiedProfileAccount mapToSimplifiedProfileAccount(Profile profile, Account account){
        SimplifiedProfileAccount simplifiedProfileAccount = new SimplifiedProfileAccount();
        simplifiedProfileAccount.setId(account.getId());
        simplifiedProfileAccount.setName(String.format("%s | %s", profile.getName(), account.getNumber()));
        simplifiedProfileAccount.setProfileId(profile.getId());
        simplifiedProfileAccount.setCurrency(account.getCurrency().getName());
        return simplifiedProfileAccount;
    }

    public Account zip(AccountCreateDto dto, Account account) {
        Account mappedAccount = this.accountService.mapToEntity(dto);
        account.setBranch(mappedAccount.getBranch());
        account.setCurrency(mappedAccount.getCurrency());
        if (mappedAccount.getCurrency() == null && dto.getCurrencyId() != null) {
            Currency newCurrency = this.currencyService.findOne(dto.getCurrencyId())
                    .orElseThrow(() -> new RuntimeException("Currency not found"));
            account.setCurrency(newCurrency);
        }
        account.setIsDebit(mappedAccount.getIsDebit());
        account.setNumber(mappedAccount.getNumber());
        account.setName(mappedAccount.getName());
        account.setLocked(mappedAccount.getLocked());
        account.setAllowedCashDeposit(mappedAccount.getAllowedCashDeposit());
        account.setAllowedCashWithdrawal(mappedAccount.getAllowedCashWithdrawal());
        account.setAllowedManualTransaction(mappedAccount.getAllowedManualTransaction());
        account.setAllowedTransferFrom(mappedAccount.getAllowedTransferFrom());
        account.setAllowedTransferTo(mappedAccount.getAllowedTransferTo());
        return account;
    }
}