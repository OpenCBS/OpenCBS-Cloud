package com.opencbs.core.repositories;

import com.opencbs.core.domain.Branch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface BranchRepository extends Repository<Branch> {

    Optional<Branch> findByName(String name);

    @Query("SELECT b FROM Branch b WHERE (lower(b.name) LIKE lower(concat('%', ?1, '%')))")
    Page<Branch> getBySearchPattern(Pageable pageable, String search);
}
