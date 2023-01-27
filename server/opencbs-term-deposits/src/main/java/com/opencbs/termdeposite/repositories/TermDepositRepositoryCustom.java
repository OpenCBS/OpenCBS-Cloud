package com.opencbs.termdeposite.repositories;

import com.opencbs.termdeposite.dto.TermDepositSimplified;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TermDepositRepositoryCustom {
    Page<TermDepositSimplified> getAllWithSearch(String searchString, Pageable pageable);
}