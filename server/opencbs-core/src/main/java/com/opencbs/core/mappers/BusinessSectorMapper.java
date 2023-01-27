package com.opencbs.core.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.trees.BusinessSector;
import com.opencbs.core.services.BusinessSectorService;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper
public class BusinessSectorMapper extends TreeEntityMapper<BusinessSectorService, BusinessSector> {
    @Autowired
    public BusinessSectorMapper(BusinessSectorService service) {
        super(service, BusinessSector.class);
    }
}
