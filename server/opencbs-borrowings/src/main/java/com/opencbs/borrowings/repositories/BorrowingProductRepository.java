package com.opencbs.borrowings.repositories;

import com.opencbs.borrowings.domain.BorrowingProduct;
import com.opencbs.core.repositories.Repository;

import java.util.Optional;

public interface BorrowingProductRepository extends Repository<BorrowingProduct> {
    Optional<BorrowingProduct> findByName(String name);
    Optional<BorrowingProduct> findByCode(String code);
}
