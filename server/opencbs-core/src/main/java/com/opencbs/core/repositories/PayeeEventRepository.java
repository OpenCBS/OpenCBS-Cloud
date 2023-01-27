package com.opencbs.core.repositories;

import com.opencbs.core.domain.PayeeEvent;

import java.util.List;

public interface PayeeEventRepository extends Repository<PayeeEvent> {

    List<PayeeEvent> findAllByLoanApplicationPayeeIdAndDeletedFalse(Long payeeId);
    Boolean existsByCheckNumberAndDeletedFalse(String number);
}
