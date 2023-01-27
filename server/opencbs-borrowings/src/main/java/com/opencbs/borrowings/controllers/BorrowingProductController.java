package com.opencbs.borrowings.controllers;

import com.opencbs.borrowings.domain.BorrowingProduct;
import com.opencbs.borrowings.domain.enums.BorrowingRuleType;
import com.opencbs.borrowings.dto.BorrowingProductDetailsDto;
import com.opencbs.borrowings.dto.BorrowingProductDto;
import com.opencbs.borrowings.mappers.BorrowingProductMapper;
import com.opencbs.borrowings.services.BorrowingProductService;
import com.opencbs.borrowings.validators.BorrowingProductValidator;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/borrowing-products")
@SuppressWarnings("unused")
public class BorrowingProductController {

    private final BorrowingProductService borrowingProductService;
    private final BorrowingProductMapper borrowingProductMapper;
    private final BorrowingProductValidator borrowingProductValidator;

    @Autowired
    public BorrowingProductController(BorrowingProductService borrowingProductService,
                                      BorrowingProductMapper borrowingProductMapper,
                                      BorrowingProductValidator borrowingProductValidator) {
        this.borrowingProductService = borrowingProductService;
        this.borrowingProductMapper = borrowingProductMapper;
        this.borrowingProductValidator = borrowingProductValidator;
    }

    @GetMapping
    public Page<BorrowingProductDetailsDto> get(Pageable pageable) {
        return this.borrowingProductService.findAll(pageable)
                .map(this.borrowingProductMapper::mapToDto);
    }

    @GetMapping(value = "/{borrowingId}")
    public BorrowingProductDetailsDto get(@PathVariable long borrowingId) throws ResourceNotFoundException {
        return this.borrowingProductService
                .findOne(borrowingId)
                .map(this.borrowingProductMapper::mapToDto)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Borrowing product not found (ID=%d).", borrowingId)));
    }

    @PostMapping
    public BorrowingProductDetailsDto create(@RequestBody BorrowingProductDto borrowingProductDto) throws ResourceNotFoundException {
        this.borrowingProductValidator.validateOnCreate(borrowingProductDto);
        BorrowingProduct borrowingProduct = this.borrowingProductMapper.mapToEntity(borrowingProductDto);
        borrowingProduct = this.borrowingProductService.create(borrowingProduct);
        return this.borrowingProductMapper.mapToDto(borrowingProduct);
    }

    @PutMapping(value = "/{borrowingId}")
    public BorrowingProductDetailsDto update(@PathVariable long borrowingId, @RequestBody BorrowingProductDto borrowingProductDto) throws ResourceNotFoundException {
        this.borrowingProductService.findOne(borrowingId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Borrowing product not found (ID=%d)", borrowingId)));
        borrowingProductDto.setId(borrowingId);
        this.borrowingProductValidator.validateOnUpdate(borrowingProductDto);
        BorrowingProduct borrowingProduct = this.borrowingProductMapper.mapToEntity(borrowingProductDto);
        borrowingProduct = this.borrowingProductService.update(borrowingProduct);
        return this.borrowingProductMapper.mapToDto(borrowingProduct);
    }

    @GetMapping(value = "/account-rules")
    public BorrowingRuleType[] getAllEnums() {
        return BorrowingRuleType.values();
    }
}
