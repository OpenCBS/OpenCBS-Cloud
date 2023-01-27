package com.opencbs.core.repositories.customs;

import com.opencbs.core.domain.trees.PaymentMethod;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PaymentMethodRepositoryCustom {

    Page<PaymentMethod> search(String query, Pageable pageable);
}
