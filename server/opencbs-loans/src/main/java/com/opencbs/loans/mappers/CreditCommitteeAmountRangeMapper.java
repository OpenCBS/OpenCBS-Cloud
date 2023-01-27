package com.opencbs.loans.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.Role;
import com.opencbs.core.mappers.RoleMapper;
import com.opencbs.core.services.RoleService;
import com.opencbs.loans.domain.creditCommittee.CreditCommitteeAmountRange;
import com.opencbs.loans.dto.creditcommittee.CreditCommitteeAmountRangeDto;
import com.opencbs.loans.dto.creditcommittee.CreditCommitteeAmountRangeUpdateDto;
import com.opencbs.loans.services.creditcommitteeservices.CreditCommitteeAmountRangeService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Mapper
public class CreditCommitteeAmountRangeMapper {

    private final CreditCommitteeAmountRangeService creditCommitteeAmountRangeService;
    private final RoleService roleService;
    private final RoleMapper roleMapper;

    @Autowired
    public CreditCommitteeAmountRangeMapper(CreditCommitteeAmountRangeService creditCommitteeAmountRangeService,
                                            RoleService roleService,
                                            RoleMapper roleMapper) {
        this.creditCommitteeAmountRangeService = creditCommitteeAmountRangeService;
        this.roleService = roleService;
        this.roleMapper = roleMapper;
    }

    private Integer index = 0;

    public CreditCommitteeAmountRangeDto mapToDto(CreditCommitteeAmountRange creditCommitteeAmountRange) {

        CreditCommitteeAmountRangeDto dto = new ModelMapper().map(creditCommitteeAmountRange, CreditCommitteeAmountRangeDto.class);

        List<CreditCommitteeAmountRange> creditCommitteeAmountRangeList = this.creditCommitteeAmountRangeService.findAll();
        creditCommitteeAmountRangeList.sort(Comparator.comparing(CreditCommitteeAmountRange::getAmount));

        BigDecimal previous;
        if (creditCommitteeAmountRangeList.get(0).equals(creditCommitteeAmountRange)) {
            previous = BigDecimal.valueOf(0);
        } else {
            for (CreditCommitteeAmountRange range : creditCommitteeAmountRangeList) {
                if (range.equals(creditCommitteeAmountRange)) {
                    index = creditCommitteeAmountRangeList.indexOf(creditCommitteeAmountRange) - 1;
                    break;
                }
            }
            previous = creditCommitteeAmountRangeList.get(index).getAmount();
        }
        dto.setMinValue(previous);
        dto.setRoles(creditCommitteeAmountRange.getRoles().stream().map(this.roleMapper::mapToDto).collect(Collectors.toList()));
        dto.setMaxValue(creditCommitteeAmountRange.getAmount());
        return dto;
    }

    public CreditCommitteeAmountRange mapToEntity(CreditCommitteeAmountRangeUpdateDto dto) {
        CreditCommitteeAmountRange creditCommitteeAmountRange = new ModelMapper().map(dto, CreditCommitteeAmountRange.class);
        creditCommitteeAmountRange.setAmount(dto.getAmount());

        List<Role> roles = dto.getRoleIds()
                .stream()
                .map(x -> this.roleService.getOne(x).get())
                .collect(Collectors.toList());
        creditCommitteeAmountRange.setRoles(roles);
        return creditCommitteeAmountRange;
    }

    public CreditCommitteeAmountRange zip(CreditCommitteeAmountRange oldCreditCommitteeAmountRange,
                                          CreditCommitteeAmountRangeUpdateDto dto) {
        CreditCommitteeAmountRange creditCommitteeAmountRange = new ModelMapper().map(dto, CreditCommitteeAmountRange.class);
        creditCommitteeAmountRange.setAmount(dto.getAmount());

        List<Role> roles = dto.getRoleIds()
                .stream()
                .map(x -> this.roleService.getOne(x).get())
                .collect(Collectors.toList());
        creditCommitteeAmountRange.setRoles(roles);
        creditCommitteeAmountRange.setCreatedBy(oldCreditCommitteeAmountRange.getCreatedBy());
        creditCommitteeAmountRange.setCreatedAt(oldCreditCommitteeAmountRange.getCreatedAt());
        return creditCommitteeAmountRange;
    }
}