package com.opencbs.loans.repositories;

import com.opencbs.core.repositories.Repository;
import com.opencbs.loans.domain.Collateral;
import org.springframework.data.domain.Sort;

import java.util.List;

public interface CollateralRepository extends Repository<Collateral> {
    List<Collateral> findCollateralByLoanApplicationId(long loanApplicationId, Sort id);
}
