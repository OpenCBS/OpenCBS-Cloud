package com.opencbs.loans.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.loans.domain.LoanApplicationEntryFee;
import com.opencbs.loans.dto.loanapplications.LoanApplicationEntryFeeUpdateDto;
import org.modelmapper.ModelMapper;

@Mapper
public class LoanApplicationEntryFeeMapper {
    public LoanApplicationEntryFeeUpdateDto mapToDto(LoanApplicationEntryFee loanApplicationEntryFee) {
        return new ModelMapper().map(loanApplicationEntryFee, LoanApplicationEntryFeeUpdateDto.class);
    }
}
