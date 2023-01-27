package com.opencbs.borrowings.services;

import com.opencbs.borrowings.domain.BorrowingProduct;
import com.opencbs.borrowings.repositories.BorrowingProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class BorrowingProductService {

    private final BorrowingProductRepository borrowingProductRepository;

    @Autowired
    public BorrowingProductService(BorrowingProductRepository borrowingProductRepository) {
        this.borrowingProductRepository = borrowingProductRepository;
    }

    public Page<BorrowingProduct> findAll(Pageable pageable) {
        return this.borrowingProductRepository.findAll(pageable);
    }

    public Optional<BorrowingProduct> findOne(long id) {
        return Optional.ofNullable(this.borrowingProductRepository.findOne(id));
    }

    public Optional<BorrowingProduct> findByName(String name) {
        return this.borrowingProductRepository.findByName(name);
    }

    public Optional<BorrowingProduct> findByCode(String code) {
        return this.borrowingProductRepository.findByCode(code);
    }

    @Transactional
    public BorrowingProduct create(BorrowingProduct borrowingProduct) {
        borrowingProduct.setId(null);
        return this.borrowingProductRepository.save(borrowingProduct);
    }

    @Transactional
    public BorrowingProduct update(BorrowingProduct borrowingProduct) {
        return this.borrowingProductRepository.save(borrowingProduct);
    }
}
