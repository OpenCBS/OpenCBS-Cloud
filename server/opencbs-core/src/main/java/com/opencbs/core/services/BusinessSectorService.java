package com.opencbs.core.services;

import com.opencbs.core.domain.trees.BusinessSector;
import com.opencbs.core.repositories.BusinessSectorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BusinessSectorService extends TreeEntityService<BusinessSectorRepository, BusinessSector> {
    @Autowired
    public BusinessSectorService(BusinessSectorRepository repository) {
        super(repository);
    }
}
