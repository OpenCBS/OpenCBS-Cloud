package com.opencbs.loans.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.mappers.CustomFieldSectionMapper;
import com.opencbs.loans.domain.customfields.LoanApplicationCustomFieldSection;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper
public class LoanApplicationCustomFieldSectionMapper extends CustomFieldSectionMapper<LoanApplicationCustomFieldSection, LoanApplicationCustomFieldMapper> {

    @Autowired
    protected LoanApplicationCustomFieldSectionMapper(LoanApplicationCustomFieldMapper customFieldMapper) {
        super(customFieldMapper);
    }
}
