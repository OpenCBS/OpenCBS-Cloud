package com.opencbs.savings.repositories.customs;

import com.opencbs.savings.domain.SavingSimplified;
import com.opencbs.savings.dto.SavingWithAccountDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SavingRepositoryCustom {

    Page<SavingSimplified> getAll(String searchString, Pageable pageable);
    Page<SavingWithAccountDto> getAllSimplifiedSavingAccount(String searchString, Pageable pageable);
}