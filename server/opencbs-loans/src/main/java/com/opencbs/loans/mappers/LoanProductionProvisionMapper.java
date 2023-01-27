package com.opencbs.loans.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.loans.domain.LoanProductProvision;
import com.opencbs.loans.dto.products.LoanProductProvisionDto;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;

@Mapper
public class LoanProductionProvisionMapper {

    private final ModelMapper modelMapper = new ModelMapper();


    public LoanProductionProvisionMapper() {
        this.modelMapper.addMappings(new PropertyMap<LoanProductProvisionDto, LoanProductProvision>() {
            @Override
            protected void configure() {
                map().setProvisionByPrincipal(source.getRatePrincipal());
                map().setProvisionByInterest(source.getRateInterest());
                map().setProvisionByPenalty(source.getRatePenalty());
                map().setLateOfDays(source.getLateDays());
            }
        });

        this.modelMapper.addMappings(new PropertyMap<LoanProductProvision, LoanProductProvisionDto>() {
            @Override
            protected void configure() {
                map().setRatePrincipal(source.getProvisionByPrincipal());
                map().setRateInterest(source.getProvisionByInterest());
                map().setRatePenalty(source.getProvisionByPenalty());
                map().setLateDays(source.getLateOfDays());
            }
        });
    }

    public LoanProductProvisionDto mapToDto(LoanProductProvision provision) {
        return this.modelMapper.map(provision, LoanProductProvisionDto.class);
    }

    public LoanProductProvision mapToEntity(LoanProductProvisionDto provisionDto) {
        final LoanProductProvision loanProductProvision = this.modelMapper.map(provisionDto, LoanProductProvision.class);
        if (provisionDto.getId() == 0) {
            loanProductProvision.setId(null);
        }
        return loanProductProvision;
    }
}
