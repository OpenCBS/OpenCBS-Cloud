package com.opencbs.core.mappers.customFields;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.customfields.CompanyCustomFieldSection;
import com.opencbs.core.mappers.CustomFieldSectionMapper;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper
public class CompanyCustomFieldSectionMapper extends CustomFieldSectionMapper<CompanyCustomFieldSection, CompanyCustomFieldMapper> {

    @Autowired
    public CompanyCustomFieldSectionMapper(CompanyCustomFieldMapper companyCustomFieldMapper) {
        super(companyCustomFieldMapper);
    }
}
