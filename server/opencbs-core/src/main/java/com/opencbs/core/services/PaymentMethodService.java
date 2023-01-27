package com.opencbs.core.services;

import com.opencbs.core.domain.trees.PaymentMethod;
import com.opencbs.core.repositories.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PaymentMethodService extends TreeEntityService<PaymentMethodRepository, PaymentMethod> {

    private final PaymentMethodRepository paymentMethodRepository;

    @Autowired
    public PaymentMethodService(PaymentMethodRepository repository,
                                PaymentMethodRepository paymentMethodRepository) {
        super(repository);
        this.paymentMethodRepository = paymentMethodRepository;
    }

    @Override
    public Page<PaymentMethod> findBy(String query, Pageable pageable) {
        if (query != null) {
            return this.paymentMethodRepository.search(query, pageable);
        }
        return this.paymentMethodRepository.findAll(pageable);
    }
}
