package com.opencbs.loans.services;

import com.opencbs.loans.domain.Collateral;
import com.opencbs.loans.repositories.CollateralRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CollateralService {

    private CollateralRepository collateralRepository;

    @Autowired
    public CollateralService(CollateralRepository collateralRepository) {
        this.collateralRepository = collateralRepository;
    }

    public Optional<Collateral> findOne(long id) {

        return Optional.ofNullable(this.collateralRepository.findOne(id));
    }

    public List<Collateral> findAll(long loanApplicationId) {
        return this.collateralRepository.findCollateralByLoanApplicationId(loanApplicationId, new Sort(Sort.Direction.ASC, "id"));
    }

    @Transactional
    public Collateral create(Collateral collateral) {
        collateral = this.collateralRepository.save(collateral);
        return collateral;
    }

    @Transactional
    public Collateral update(Collateral collateral) {
        return this.collateralRepository.save(collateral);
    }
}
