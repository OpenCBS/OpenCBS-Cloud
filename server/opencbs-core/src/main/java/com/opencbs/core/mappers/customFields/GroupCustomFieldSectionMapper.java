package com.opencbs.core.mappers.customFields;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.customfields.GroupCustomFieldSection;
import com.opencbs.core.mappers.CustomFieldSectionMapper;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper
public class GroupCustomFieldSectionMapper extends CustomFieldSectionMapper<GroupCustomFieldSection, GroupCustomFieldMapper> {

    @Autowired
    public GroupCustomFieldSectionMapper(GroupCustomFieldMapper groupCustomFieldMapper) {
        super(groupCustomFieldMapper);
    }
}
