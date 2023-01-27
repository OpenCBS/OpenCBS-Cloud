package com.opencbs.termdeposite.mapper;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.ProfileService;
import com.opencbs.core.services.UserService;
import com.opencbs.termdeposite.domain.TermDeposit;
import com.opencbs.termdeposite.domain.TermDepositProduct;
import com.opencbs.termdeposite.domain.enums.TermDepositAccountType;
import com.opencbs.termdeposite.dto.GetTermDepositDetailsDto;
import com.opencbs.termdeposite.dto.TermDepositDetailsDto;
import com.opencbs.termdeposite.dto.TermDepositDto;
import com.opencbs.termdeposite.services.TermDepositAccountingService;
import com.opencbs.termdeposite.services.TermDepositProductsService;
import lombok.NonNull;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.util.Optional;

@Mapper
public class TermDepositMapper {

    private final TermDepositProductMapper termDepositProductMapper;
    private final ProfileService profileService;
    private final UserService userService;
    private final TermDepositAccountMapper termDepositAccountMapper;
    private final TermDepositProductsService termDepositProductsService;
    private final TermDepositAccountingService termDepositAccountingService;
    private final AccountService accountService;


    @Autowired
    public TermDepositMapper(@NonNull TermDepositProductMapper termDepositProductMapper,
                             @NonNull ProfileService profileService,
                             @NonNull UserService userService,
                             @NonNull TermDepositAccountMapper termDepositAccountMapper,
                             @NonNull TermDepositProductsService termDepositProductsService,
                             @NonNull TermDepositAccountingService termDepositAccountingService,
                             @NonNull AccountService accountService) {
        this.termDepositProductMapper = termDepositProductMapper;
        this.profileService = profileService;
        this.userService = userService;
        this.termDepositAccountMapper = termDepositAccountMapper;
        this.termDepositProductsService = termDepositProductsService;
        this.termDepositAccountingService = termDepositAccountingService;
        this.accountService = accountService;
    }

    public TermDeposit mapToEntity(TermDepositDto dto) {
        Optional<Profile> optionalProfile = profileService.findOne(dto.getProfileId());
        if (!optionalProfile.isPresent()) {
            throw new RuntimeException(String.format("Not found Profile with id=%d", dto.getProfileId()));
        }
        Optional<TermDepositProduct> optionalTermDepositProduct = this.termDepositProductsService.getOne(dto.getTermDepositProductId());
        if (!optionalProfile.isPresent()) {
            throw new RuntimeException(String.format("Not found Term Deposit Product with id=%d", dto.getTermDepositProductId()));
        }
        Optional<User> optionalUser = this.userService.findById(dto.getServiceOfficerId());
        if (!optionalProfile.isPresent()) {
            throw new RuntimeException(String.format("Not found User with id=%d", dto.getServiceOfficerId()));
        }

        ModelMapper modelMapper = new ModelMapper();
        TermDeposit termDeposit = modelMapper.map(dto, TermDeposit.class);
        termDeposit.setProfile(optionalProfile.get());
        termDeposit.setTermDepositProduct(optionalTermDepositProduct.get());
        termDeposit.setServiceOfficer(optionalUser.get());
        termDeposit.setCreatedAt(dto.getCreatedDate());

        termDeposit.setCreatedBy(optionalUser.get());

        return termDeposit;
    }

    public TermDepositDetailsDto mapToDetailDto(TermDeposit termDeposit) {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.addMappings(new TermDepositToDtoMap());
        TermDepositDetailsDto termDepositDetailsDto = modelMapper.map(termDeposit, TermDepositDetailsDto.class);
        termDepositDetailsDto.setAccounts(this.termDepositAccountMapper.mapToDto(termDeposit.getAccounts()));
        termDepositDetailsDto.setTermDepositProduct(this.termDepositProductMapper.entityToDto(termDeposit.getTermDepositProduct()));

        return termDepositDetailsDto;
    }

    public GetTermDepositDetailsDto mapToGetDetailDto(TermDeposit termDeposit) {
        ModelMapper modelMapper = new ModelMapper();
        GetTermDepositDetailsDto getTermDepositDetailsDto = modelMapper.map(termDeposit, GetTermDepositDetailsDto.class);

        if (termDeposit.getAccounts() != null && !termDeposit.getAccounts().isEmpty()) {
            Account termDepositAccount = this.termDepositAccountingService.getAccountByType(termDeposit.getAccounts(), TermDepositAccountType.PRINCIPAL);
            BigDecimal termDepositAccountBalance = this.accountService.getAccountBalance(termDepositAccount.getId(), DateHelper.getLocalDateTimeNow());
            getTermDepositDetailsDto.setTermDepositBalance(termDepositAccountBalance);

            Account interestAccount = this.termDepositAccountingService.getAccountByType(termDeposit.getAccounts(), TermDepositAccountType.INTEREST_ACCRUAL);
            BigDecimal interestAccountBalance = this.accountService.getAccountBalance(interestAccount.getId(), DateHelper.getLocalDateTimeNow());
            getTermDepositDetailsDto.setAccruedInterest(interestAccountBalance);
        }

        return getTermDepositDetailsDto;
    }

    private class TermDepositToDtoMap extends PropertyMap<TermDeposit, TermDepositDetailsDto> {
        protected void configure() {
            skip().setAccounts(null);
            skip().setTermDepositProduct(null);
        }
    }

}
