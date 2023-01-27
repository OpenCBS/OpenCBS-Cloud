package com.opencbs.loans.services;

import com.opencbs.loans.domain.products.LoanProduct;
import com.opencbs.loans.domain.products.LoanProductAccount;
import com.opencbs.loans.repositories.LoanProductAccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoanProductAccountService {

    private final LoanProductAccountRepository loanProductAccountRepository;

    public LoanProductAccountService(LoanProductAccountRepository loanProductAccountRepository) {
        this.loanProductAccountRepository = loanProductAccountRepository;
    }

    @Transactional
    public List<LoanProductAccount> create(List<LoanProductAccount> loanProductAccount, LoanProduct loanProduct) {
        loanProductAccount.forEach(x -> x.setLoanProduct(loanProduct));
        return loanProductAccount.stream()
                .map(this::create)
                .collect(Collectors.toList());
    }

    @Transactional
    public LoanProductAccount create(LoanProductAccount loanProductAccount) {
        return this.loanProductAccountRepository.save(loanProductAccount);
    }

    public List<LoanProductAccount> getAllByLoanProductId(Long loanProductId) {
        return this.loanProductAccountRepository.getAllByLoanProductId(loanProductId);
    }

    public List<LoanProductAccount> update(
            List<LoanProductAccount> loanProductAccount,
            LoanProduct loanProduct) {
        this.getAllByLoanProductId(loanProduct.getId())
                .forEach(x -> this.loanProductAccountRepository.delete(x.getId()));
        return this.create(loanProductAccount, loanProduct);
    }
}
