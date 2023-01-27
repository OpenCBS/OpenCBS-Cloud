package com.opencbs.core.mappers;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.mappers.AccountMapper;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.OtherFee;
import com.opencbs.core.domain.User;
import com.opencbs.core.dto.CreateOtherFeeDto;
import com.opencbs.core.dto.OtherFeeDetailDto;
import com.opencbs.core.helpers.DateHelper;
import org.modelmapper.ModelMapper;

import java.util.Optional;

@Mapper
public class OtherFeeMapper {
    private final AccountService accountService;
    protected final AccountMapper accountMapper;

    public OtherFeeMapper(AccountService accountService, AccountMapper accountMapper){
        this.accountService = accountService;
        this.accountMapper = accountMapper;
    }

    public OtherFeeDetailDto mapToDto(OtherFee otherFee) {
        OtherFeeDetailDto otherFeeDetailDto = new ModelMapper().map(otherFee, OtherFeeDetailDto.class);
        otherFeeDetailDto.setChargeAccount(this.accountMapper.map(otherFee.getChargeAccount()));
        otherFeeDetailDto.setIncomeAccount(this.accountMapper.map(otherFee.getIncomeAccount()));
        otherFeeDetailDto.setExpenseAccount(this.accountMapper.map(otherFee.getExpenseAccount()));
        otherFeeDetailDto.setCreatedAt(otherFee.getCreatedAt());
        otherFeeDetailDto.setDescription(otherFee.getDescription());
        return otherFeeDetailDto;
    }

    public OtherFee mapToEntity(CreateOtherFeeDto otherFeeDto, User currentUser){
        ModelMapper mapper = new ModelMapper();
        OtherFee otherFee = mapper.map(otherFeeDto, OtherFee.class);
        otherFee.setCreatedBy(currentUser);
        otherFee.setCreatedAt(DateHelper.getLocalDateTimeNow());
        Optional<Account> chargeAccount = this.accountService.findOne(otherFeeDto.getChargeAccountId());
        Optional<Account> incomeAccount = this.accountService.findOne(otherFeeDto.getIncomeAccountId());
        Optional<Account> expenseAccount = this.accountService.findOne(otherFeeDto.getExpenseAccountId());
        otherFee.setChargeAccount(chargeAccount.get());
        otherFee.setIncomeAccount(incomeAccount.get());
        otherFee.setExpenseAccount(expenseAccount.get());
        otherFee.setDescription(otherFeeDto.getDescription());
        return otherFee;
    }


    public OtherFeeDetailDto mapToOtherFeeDetailDto(OtherFee otherFee){
        OtherFeeDetailDto otherFeeDetailDto = new ModelMapper().map(otherFee, OtherFeeDetailDto.class);
        otherFeeDetailDto.setChargeAccount(this.accountMapper.map(otherFee.getChargeAccount()));
        otherFeeDetailDto.setIncomeAccount(this.accountMapper.map(otherFee.getIncomeAccount()));
        otherFeeDetailDto.setExpenseAccount(this.accountMapper.map(otherFee.getExpenseAccount()));
        otherFeeDetailDto.setCreatedAt(otherFee.getCreatedAt());
        otherFeeDetailDto.setDescription(otherFee.getDescription());
        return otherFeeDetailDto;
    }

}
