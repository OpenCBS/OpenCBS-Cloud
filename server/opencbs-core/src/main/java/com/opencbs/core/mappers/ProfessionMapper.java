package com.opencbs.core.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.trees.Profession;
import com.opencbs.core.services.ProfessionService;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper
public class ProfessionMapper extends TreeEntityMapper<ProfessionService, Profession> {

    @Autowired
    public ProfessionMapper(ProfessionService service) {
        super(service, Profession.class);
    }
}