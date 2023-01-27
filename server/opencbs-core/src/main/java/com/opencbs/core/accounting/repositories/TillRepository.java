package com.opencbs.core.accounting.repositories;

import com.opencbs.core.accounting.repositories.customs.TillRepositoryCustom;
import com.opencbs.core.domain.enums.TillStatus;
import com.opencbs.core.domain.till.Till;
import com.opencbs.core.repositories.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TillRepository extends TillRepositoryCustom, Repository<Till> {

    Optional<Till> findByName(String name);

    @Query("SELECT t FROM Till t WHERE (lower(t.name) LIKE lower(concat('%', ?1, '%')))")
    Page<Till> findBySearchPattern(Pageable pageable, String searchString);

    List<Till> findAllByStatus(TillStatus status);
}
