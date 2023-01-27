package com.opencbs.core.services;

import com.opencbs.core.domain.PayeeEvent;
import com.opencbs.core.repositories.PayeeEventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PayeeEventService {

    private final PayeeEventRepository payeeEventRepository;

    public PayeeEventService(PayeeEventRepository payeeEventRepository){
        this.payeeEventRepository = payeeEventRepository;
    }

    public List<PayeeEvent> findAllByLoanApplicationPayee(Long payeeId){
        return this.payeeEventRepository.findAllByLoanApplicationPayeeIdAndDeletedFalse(payeeId);
    }

    public Boolean findByCheck(String number) {
        return this.payeeEventRepository.existsByCheckNumberAndDeletedFalse(number);
    }

    public void save(PayeeEvent payeeEvent){
        this.payeeEventRepository.save(payeeEvent);
    }
}
