package com.opencbs.loans.repositories;

import com.opencbs.core.repositories.Repository;
import com.opencbs.loans.domain.customfields.TypeOfCollateral;

import java.util.Optional;

public interface TypeOfCollateralRepository extends Repository<TypeOfCollateral> {
    Optional<TypeOfCollateral> findByCaption(String typeOfCollateralCaption);
}
