package com.opencbs.core.repositories;

import com.opencbs.core.domain.customfields.CustomFieldValue;
import com.opencbs.core.domain.enums.EntityStatus;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.Optional;

@NoRepositoryBean
public interface CustomFieldValueRepository<T extends CustomFieldValue> extends Repository<T> {
    Optional<T> findOneByCustomFieldIdAndStatusAndValue(Long fieldId, EntityStatus status, String value);
}
