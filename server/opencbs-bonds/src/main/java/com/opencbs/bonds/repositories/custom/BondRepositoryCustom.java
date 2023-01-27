package com.opencbs.bonds.repositories.custom;

import com.opencbs.bonds.domain.SimplifiedBond;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BondRepositoryCustom {

    Page<SimplifiedBond> findAllSimplifiedBonds(String searchQuery, Pageable pageable);
}