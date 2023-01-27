package com.opencbs.bonds.services;

import com.opencbs.bonds.repositories.BondEventGroupKeyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BondEventGroupKeyService {
    private final BondEventGroupKeyRepository bondEventGroupKeyRepository;

    @Autowired
    public BondEventGroupKeyService(BondEventGroupKeyRepository bondEventGroupKeyRepository) {
        this.bondEventGroupKeyRepository = bondEventGroupKeyRepository;
    }

    public Long getNextBondEventGroupKey(){
        return this.bondEventGroupKeyRepository.getNextEventGroupKey();
    }
}
