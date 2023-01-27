package com.opencbs.core.services;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.EntryFee;
import com.opencbs.core.repositories.EntryFeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EntryFeeService {

    private final EntryFeeRepository entryFeeRepository;

    @Autowired
    public EntryFeeService(EntryFeeRepository entryFeeRepository) {
        this.entryFeeRepository = entryFeeRepository;
    }

    public List<EntryFee> findAll() {
        return this.entryFeeRepository.findAll(new Sort(Sort.Direction.ASC, "id"));
    }

    public List<EntryFee> findAllByCurrency(Long currencyId){
        return entryFeeRepository.findByAccount_Currency_Id(currencyId).stream()
                .sorted((Comparator.comparing(BaseEntity::getId)))
                .collect(Collectors.toList());
    }

    public List<EntryFee> findAllByIds(Iterable<Long> ids) {
        return this.entryFeeRepository.findAll(ids);
    }

    public Optional<EntryFee> findOne(long id) {
        return Optional.ofNullable(this.entryFeeRepository.findOne(id));
    }

    @Transactional
    public EntryFee create(EntryFee entryFee) {
        return this.entryFeeRepository.save(entryFee);
    }

    @Transactional
    public EntryFee update(EntryFee entryFee) {
        return this.entryFeeRepository.save(entryFee);
    }
}
