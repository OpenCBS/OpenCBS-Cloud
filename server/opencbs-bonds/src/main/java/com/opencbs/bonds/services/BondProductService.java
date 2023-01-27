package com.opencbs.bonds.services;

import com.opencbs.bonds.domain.BondProduct;
import com.opencbs.bonds.repositories.BondProductRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BondProductService {

    private final BondProductRepository bondProductRepository;

    public BondProductService(BondProductRepository bondProductRepository) {
        this.bondProductRepository = bondProductRepository;
    }

    public Optional<BondProduct> getDefaultBondProduct(){
        return this.bondProductRepository.findAll().stream().findFirst();
    }

    public BondProduct findOne(Long productId){
        return this.bondProductRepository.findOne(productId);
    }
}
