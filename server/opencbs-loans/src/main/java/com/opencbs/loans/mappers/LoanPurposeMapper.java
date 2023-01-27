package com.opencbs.loans.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.mappers.TreeEntityMapper;
import com.opencbs.loans.domain.trees.LoanPurpose;
import com.opencbs.loans.services.LoanPurposeService;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper
public class LoanPurposeMapper extends TreeEntityMapper<LoanPurposeService, LoanPurpose> {
    @Autowired
    public LoanPurposeMapper(LoanPurposeService service) {
        super(service, LoanPurpose.class);
    }
}
