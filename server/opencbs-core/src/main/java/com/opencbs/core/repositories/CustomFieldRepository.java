package com.opencbs.core.repositories;

import com.opencbs.core.domain.customfields.CustomField;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;
import java.util.Optional;

@NoRepositoryBean
public interface CustomFieldRepository<T extends CustomField> extends Repository<T> {

    List<T> findBySectionId(long sectionId);
    Optional<T> findByName(String name);
    Optional<T> findOneBySectionIdAndName(Long sectionId, String name);
}
