package com.opencbs.core.mappers.customFields;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.customfields.BranchCustomFieldSection;
import com.opencbs.core.mappers.CustomFieldSectionMapper;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper
public class BranchCustomFieldSectionMapper extends CustomFieldSectionMapper<BranchCustomFieldSection, BranchCustomFieldMapper> {

    @Autowired
    protected BranchCustomFieldSectionMapper(BranchCustomFieldMapper customFieldMapper) {
        super(customFieldMapper);
    }
}
