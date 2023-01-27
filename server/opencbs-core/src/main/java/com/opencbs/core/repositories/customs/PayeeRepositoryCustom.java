package com.opencbs.core.repositories.customs;

import com.opencbs.core.domain.Payee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PayeeRepositoryCustom {
    Page<Payee> search(Pageable pageable, String query);
}