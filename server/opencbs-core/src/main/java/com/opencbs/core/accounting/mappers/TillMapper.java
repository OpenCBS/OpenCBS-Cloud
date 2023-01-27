package com.opencbs.core.accounting.mappers;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.dto.TillDetailsDto;
import com.opencbs.core.accounting.dto.TillDto;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.till.Till;
import com.opencbs.core.dto.UserInfoDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.BranchService;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Set;

@Mapper
public class TillMapper {

    private final BranchService branchService;
    private final AccountService accountService;

    private class TillToTillDetailsDtoMap extends PropertyMap<Till, TillDetailsDto> {
        protected void configure() {
            skip().setTeller(null);
        }
    }

    @Autowired
    public TillMapper(BranchService branchService,
                      AccountService accountService) {
        this.branchService = branchService;
        this.accountService = accountService;
    }

    public Till mapToEntity(TillDto dto) {
        Till till = new ModelMapper().map(dto, Till.class);
        Branch branch = this.branchService.findOne(dto.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Branch not found (ID=%d).", dto.getBranchId())));
        till.setBranch(branch);
        Set<Account> accounts = this.getAccounts(dto.getAccounts());
        till.setAccounts(accounts);
        return till;
    }

    public TillDetailsDto mapToDto(Till till) {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.addMappings(new TillToTillDetailsDtoMap());
        TillDetailsDto dto = modelMapper.map(till, TillDetailsDto.class);
        UserInfoDto userInfoDto = till.getEvents() != null && till.getTeller() != null
                ? modelMapper.map(till.getTeller(), UserInfoDto.class)
                : null;
        dto.setTeller(userInfoDto);
        dto.setBalance(this.accountService.getAccountBalance(till.getAccounts().iterator().next().getId(), DateHelper.getLocalDateTimeNow()));
        return dto;
    }

    public Till zip(Till till, TillDto dto) {
        Till zipTill = this.mapToEntity(dto);
        zipTill.setId(till.getId());
        zipTill.setStatus(till.getStatus());
        zipTill.setOpenedAt(till.getOpenedAt());
        zipTill.setClosedAt(till.getClosedAt());
        return zipTill;
    }

    private Set<Account> getAccounts(Set<Long> accountIds) {
        return this.accountService.findByIds(accountIds);
    }
}