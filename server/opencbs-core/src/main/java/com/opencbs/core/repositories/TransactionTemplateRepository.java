package com.opencbs.core.repositories;

import com.opencbs.core.domain.TransactionTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface TransactionTemplateRepository extends Repository<TransactionTemplate> {

    Optional<TransactionTemplate> findByName(String name);

    Page<TransactionTemplate> findByNameLike(String name, Pageable pageable);
}
