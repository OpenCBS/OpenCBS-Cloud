package com.opencbs.bonds.controllers;

import com.opencbs.bonds.domain.BondProduct;
import com.opencbs.bonds.dto.BondProductDetailsDto;
import com.opencbs.bonds.services.BondProductService;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "api/bond-products")
public class BondProductController {

    private final BondProductService bondProductService;

    @Autowired
    public BondProductController(BondProductService bondProductService) {
        this.bondProductService = bondProductService;
    }

    @GetMapping(value = "/default")
    public BondProductDetailsDto getDefaultProduct(){
        BondProduct defaultBondProduct = bondProductService.getDefaultBondProduct().orElseThrow(()->new ResourceNotFoundException("Default Bond Product is not found"));
        return new ModelMapper().map(defaultBondProduct, BondProductDetailsDto.class);
    }
}
