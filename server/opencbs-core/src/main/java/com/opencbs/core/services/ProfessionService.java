package com.opencbs.core.services;

import com.opencbs.core.domain.trees.Profession;
import com.opencbs.core.repositories.ProfessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProfessionService extends TreeEntityService<ProfessionRepository, Profession> {

    @Autowired
    public ProfessionService(ProfessionRepository repository) {
        super(repository);
    }
}
