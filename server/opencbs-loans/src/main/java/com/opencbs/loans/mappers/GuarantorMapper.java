package com.opencbs.loans.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.loans.domain.Guarantor;
import com.opencbs.loans.dto.GuarantorDetailDto;
import com.opencbs.loans.dto.GuarantorDto;
import org.modelmapper.ModelMapper;

@Mapper
public class GuarantorMapper {

    public GuarantorDetailDto mapToDto(Guarantor guarantor) {
        GuarantorDetailDto map = new ModelMapper().map(guarantor, GuarantorDetailDto.class);
        map.setDeleted(map.getClosedAt() != null);
        return map;
    }

    public Guarantor mapToEntity(GuarantorDto dto) {
       return new ModelMapper().map(dto, Guarantor.class);
    }
}
