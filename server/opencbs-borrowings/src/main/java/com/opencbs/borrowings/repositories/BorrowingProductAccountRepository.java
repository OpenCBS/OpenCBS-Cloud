package com.opencbs.borrowings.repositories;

import com.opencbs.core.repositories.Repository;
import com.opencbs.borrowings.domain.BorrowingProductAccount;

import java.util.List;

public interface BorrowingProductAccountRepository extends Repository<BorrowingProductAccount> {
    List<BorrowingProductAccount> getAllByBorrowingProductId(Long borrowingProductId);
}