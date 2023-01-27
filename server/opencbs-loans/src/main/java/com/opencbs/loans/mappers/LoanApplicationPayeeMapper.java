package com.opencbs.loans.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.loans.domain.LoanApplicationPayees;
import com.opencbs.loans.domain.enums.LoanApplicationPayeeStatus;
import com.opencbs.loans.dto.loanapplications.LoanApplicationPayeesDto;
import com.opencbs.loans.dto.loanapplications.LoanApplicationPayeesUpdateDto;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;

@Mapper
public class LoanApplicationPayeeMapper {

    private class LoanApplicationPayeesDtoToLoanApplicationPayees extends PropertyMap<LoanApplicationPayeesDto, LoanApplicationPayees> {
        protected void configure() {
            skip().setStatus(null);
        }
    }

    public LoanApplicationPayeesUpdateDto mapToDto(LoanApplicationPayees loanApplicationPayees) {
        LoanApplicationPayeesUpdateDto dto = new ModelMapper().map(loanApplicationPayees, LoanApplicationPayeesUpdateDto.class);
        return dto;
    }

    public LoanApplicationPayees mapToEntity(LoanApplicationPayeesDto dto) {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.addMappings(new LoanApplicationPayeesDtoToLoanApplicationPayees());
        return modelMapper.map(dto, LoanApplicationPayees.class);
    }

    public LoanApplicationPayees zip(LoanApplicationPayees loanApplicationPayees, LoanApplicationPayeesDto dto) {
        LoanApplicationPayees zippedPayee = this.mapToEntity(dto);
        zippedPayee.setStatus(LoanApplicationPayeeStatus.DISBURSED);
        zippedPayee.setPlannedDisbursementDate(loanApplicationPayees.getPlannedDisbursementDate());
        zippedPayee.setPayee(loanApplicationPayees.getPayee());
        zippedPayee.setLoanApplication(loanApplicationPayees.getLoanApplication());
        zippedPayee.setAmount(loanApplicationPayees.getAmount());
        zippedPayee.setDescription(loanApplicationPayees.getDescription());
        zippedPayee.setClosedAt(loanApplicationPayees.getClosedAt());
        zippedPayee.setClosedBy(loanApplicationPayees.getClosedBy());
        return zippedPayee;
    }

    public LoanApplicationPayees refund(LoanApplicationPayees loanApplicationPayees, LoanApplicationPayeesDto dto) {
        LoanApplicationPayees zippedPayee = this.mapToEntity(dto);
        zippedPayee.setStatus(LoanApplicationPayeeStatus.REFUNDED);
        zippedPayee.setPlannedDisbursementDate(loanApplicationPayees.getPlannedDisbursementDate());
        zippedPayee.setPayee(loanApplicationPayees.getPayee());
        zippedPayee.setLoanApplication(loanApplicationPayees.getLoanApplication());
        zippedPayee.setAmount(loanApplicationPayees.getAmount());
        zippedPayee.setDescription(loanApplicationPayees.getDescription());
        zippedPayee.setClosedAt(loanApplicationPayees.getClosedAt());
        zippedPayee.setClosedBy(loanApplicationPayees.getClosedBy());
        zippedPayee.setDisbursementDate(loanApplicationPayees.getDisbursementDate());
        return zippedPayee;
    }
}
