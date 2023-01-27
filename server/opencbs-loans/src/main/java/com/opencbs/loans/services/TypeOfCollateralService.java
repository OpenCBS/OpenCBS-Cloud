package com.opencbs.loans.services;

import com.opencbs.core.services.customFields.CustomFieldSectionService;
import com.opencbs.loans.domain.customfields.TypeOfCollateral;
import com.opencbs.loans.repositories.TypeOfCollateralRepository;
import org.springframework.stereotype.Service;

@Service
public class TypeOfCollateralService extends CustomFieldSectionService<TypeOfCollateral, TypeOfCollateralRepository> {
    public TypeOfCollateralService(TypeOfCollateralRepository repository) {
        super(repository);
    }
}
