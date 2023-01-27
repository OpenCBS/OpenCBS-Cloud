package com.opencbs.core.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.domain.Payee;
import com.opencbs.core.dto.PayeeDetailsDto;
import com.opencbs.core.mappers.PayeeMapper;
import com.opencbs.core.repositories.PayeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PayeeService {

    private PayeeRepository payeeRepository;
    private final PayeeMapper payeeMapper;

    @Autowired
    public PayeeService(PayeeRepository payeeRepository,
                        PayeeMapper payeeMapper) {
        this.payeeRepository = payeeRepository;
        this.payeeMapper = payeeMapper;
    }

    @Transactional
    public Payee create(Payee payee) {
        payee.setId(null);
        return this.payeeRepository.save(payee);
    }

    public Optional<Payee> findByName(String name) {
        return this.payeeRepository.findByName(name);
    }

    public Optional<Payee> findOneByPayeeAccounts(Account account) {
        return this.payeeRepository.findOneByPayeeAccounts(account);
    }

    public Optional<Payee> findOne(long id) {
        return Optional.ofNullable(this.payeeRepository.findOne(id));
    }

    public Page<Payee> findAll(Pageable pageable) {
        return this.payeeRepository.findAll(pageable);
    }

    @Transactional
    public Payee update(Payee payee) {
        return this.payeeRepository.save(payee);
    }

    public Page<Payee> search(Pageable pageable, String searchString) {
        return this.payeeRepository.search(pageable, searchString);
    }

    public Page<PayeeDetailsDto> getPayeeForLookup(Pageable pageable, String searchString){
        if (searchString == null) {
            searchString = "";
        }
        Page<Payee> payeesPage = this.search(pageable, searchString);

        List<PayeeDetailsDto> payees = payeesPage.getContent()
                .stream()
                .map(this.payeeMapper::mapToDto)
                .collect(Collectors.toList());
        return new PageImpl<>(payees, pageable, payeesPage.getTotalElements());
    }
}
