package com.opencbs.core.repositories;

import com.opencbs.core.domain.trees.PaymentMethod;
import com.opencbs.core.repositories.customs.PaymentMethodRepositoryCustom;

public interface PaymentMethodRepository extends TreeEntityRepository<PaymentMethod>, PaymentMethodRepositoryCustom {
}
