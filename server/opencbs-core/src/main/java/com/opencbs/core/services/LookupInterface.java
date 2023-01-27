package com.opencbs.core.services;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.dto.customfields.CustomFieldLookupValueDto;

import java.util.ArrayList;
import java.util.Optional;

public interface LookupInterface {

     ArrayList<String> getLookupTypes();

     <T extends BaseEntity> Optional<T> getLookup(String type, Long id);

     CustomFieldLookupValueDto getLookupValueObject(String lookupType, Long id);
}
