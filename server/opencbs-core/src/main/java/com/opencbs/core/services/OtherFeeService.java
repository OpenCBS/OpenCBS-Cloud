package com.opencbs.core.services;

import com.opencbs.core.domain.OtherFee;
import com.opencbs.core.mappers.OtherFeeMapper;
import com.opencbs.core.repositories.OtherFeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class OtherFeeService {

    protected final OtherFeeRepository otherFeeRepository;
    protected final EventGroupKeyService eventGroupKeyService;
    protected final OtherFeeMapper otherFeeMapper;


    @Autowired
    public OtherFeeService(OtherFeeRepository otherFeeRepository,
                           EventGroupKeyService eventGroupKeyService,
                           OtherFeeMapper otherFeeMapper) {
        this.otherFeeRepository = otherFeeRepository;
        this.eventGroupKeyService = eventGroupKeyService;
        this.otherFeeMapper = otherFeeMapper;
    }

    @Transactional
    public OtherFee save(OtherFee otherFee){
       return otherFeeRepository.save(otherFee);
    }

    @Transactional
    public OtherFee update(OtherFee otherFee){
       return otherFeeRepository.save(otherFee);
    }

    public Optional<OtherFee> getById(Long id) {
        return Optional.ofNullable(this.otherFeeRepository.findOne(id));
    }

    public Optional<OtherFee> getByName(String name){
        return otherFeeRepository.findByName(name);
    }

    public List<OtherFee> getAllOtherFees(){
        return this.otherFeeRepository.findAll(new Sort(Sort.Direction.ASC, "id"));
    }


}
