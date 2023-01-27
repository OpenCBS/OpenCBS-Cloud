package com.opencbs.loans.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.mappers.CustomFieldSectionMapper;
import com.opencbs.loans.domain.customfields.TypeOfCollateral;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper
public class TypeOfCollateralMapper extends CustomFieldSectionMapper<TypeOfCollateral, TypeOfCollateralCustomFieldMapper> {

    @Autowired
    public TypeOfCollateralMapper(TypeOfCollateralCustomFieldMapper customFieldMapper) {
        super(customFieldMapper);
    }
}
