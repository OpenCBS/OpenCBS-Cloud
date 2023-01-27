package com.opencbs.termdeposite.work;

import com.opencbs.core.annotations.Work;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.termdeposite.domain.TermDepositProduct;
import com.opencbs.termdeposite.dto.TermDepositProductDetailsDto;
import com.opencbs.termdeposite.dto.TermDepositProductDto;
import com.opencbs.termdeposite.mapper.TermDepositProductMapper;
import com.opencbs.termdeposite.services.TermDepositProductsService;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Work
public class TermDepositProductWork {

    private final TermDepositProductsService termDepositProductsService;
    private final TermDepositProductMapper termDepositProductMapper;


    @Autowired
    public TermDepositProductWork(@NonNull TermDepositProductsService termDepositProductsService,
                                  @NonNull TermDepositProductMapper termDepositProductMapper) {
        this.termDepositProductsService = termDepositProductsService;
        this.termDepositProductMapper = termDepositProductMapper;
    }

    public Page getAll(Pageable pageable, String searchString, Boolean showAll) {
        if (showAll) {
            return this.termDepositProductsService.getAll(pageable, searchString).map(this.termDepositProductMapper::entityToSimplifiedDto);
        }

        return this.termDepositProductsService.getActiveTermDepositProduct(pageable, searchString).map(this.termDepositProductMapper::entityToSimplifiedDto);
    }

    public TermDepositProductDetailsDto getById(Long id) {
        return this.termDepositProductsService.getOne(id).map(this.termDepositProductMapper::entityToDto)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Term deposit product not found (ID=%d)", id)));
    }

    public TermDepositProduct create(@NonNull TermDepositProductDto termDepositProductDto) {
        TermDepositProduct termDepositProduct = this.termDepositProductMapper.mapToEntity(termDepositProductDto);
        termDepositProduct.setId(null);
        return termDepositProductsService.save(termDepositProduct);
    }

    public TermDepositProduct update(@NonNull TermDepositProductDto termDepositProductDto) {
        TermDepositProduct termDepositProduct = this.termDepositProductMapper.mapToEntity(termDepositProductDto);
        return this.termDepositProductsService.save(termDepositProduct);
    }

}
