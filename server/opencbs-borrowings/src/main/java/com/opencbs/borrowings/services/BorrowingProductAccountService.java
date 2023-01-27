package com.opencbs.borrowings.services;

import com.opencbs.borrowings.domain.BorrowingProduct;
import com.opencbs.borrowings.domain.BorrowingProductAccount;
import com.opencbs.borrowings.repositories.BorrowingProductAccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BorrowingProductAccountService {

    private final BorrowingProductAccountRepository borrowingProductAccountRepository;

    public BorrowingProductAccountService(BorrowingProductAccountRepository borrowingProductAccountRepository) {
        this.borrowingProductAccountRepository = borrowingProductAccountRepository;
    }

    @Transactional
    public List<BorrowingProductAccount> create(List<BorrowingProductAccount> borrowingProductAccounts, BorrowingProduct borrowingProduct) {
        borrowingProductAccounts.forEach(x -> x.setBorrowingProduct(borrowingProduct));
        return borrowingProductAccounts.stream()
                .map(this::create)
                .collect(Collectors.toList());
    }

    @Transactional
    public BorrowingProductAccount create(BorrowingProductAccount borrowingProductAccount) {
        return this.borrowingProductAccountRepository.save(borrowingProductAccount);
    }

    public List<BorrowingProductAccount> getAllByBorrowingProductId(Long borrowingProductId) {
        return this.borrowingProductAccountRepository.getAllByBorrowingProductId(borrowingProductId);
    }

    public List<BorrowingProductAccount> update(List<BorrowingProductAccount> borrowingProductAccounts, BorrowingProduct borrowingProduct) {
        this.getAllByBorrowingProductId(borrowingProduct.getId())
                .forEach(x -> this.borrowingProductAccountRepository.delete(x.getId()));
        return this.create(borrowingProductAccounts, borrowingProduct);
    }
}
