package com.opencbs.savings.mappers;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.ProfileService;
import com.opencbs.core.services.UserService;
import com.opencbs.savings.domain.Saving;
import com.opencbs.savings.domain.SavingProduct;
import com.opencbs.savings.domain.enums.SavingAccountRuleType;
import com.opencbs.savings.dto.SavingDetailsDto;
import com.opencbs.savings.dto.SavingDto;
import com.opencbs.savings.services.SavingAccountingService;
import com.opencbs.savings.services.SavingProductService;
import com.opencbs.savings.services.SavingService;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;

import java.math.BigDecimal;

@Mapper
public class SavingMapper {

    private class SavingToDtoMap extends PropertyMap<Saving, SavingDetailsDto> {
        protected void configure() {
            skip().setSavingOfficerName(null);
        }
    }

    private final SavingProductService savingProductService;
    private final ProfileService profileService;
    private final UserService userService;
    private final SavingAccountingService savingAccountingService;
    private final SavingService savingService;

    public SavingMapper(SavingProductService savingProductService,
                        ProfileService profileService,
                        UserService userService,
                        SavingAccountingService savingAccountingService,
                        SavingService savingService) {
        this.savingProductService = savingProductService;
        this.profileService = profileService;
        this.userService = userService;
        this.savingAccountingService = savingAccountingService;
        this.savingService = savingService;
    }

    public Saving mapToEntity(SavingDto dto) {
        ModelMapper modelMapper = new ModelMapper();
        Saving saving = modelMapper.map(dto, Saving.class);
        Profile profile = profileService.findOne(dto.getProfileId()).get();
        saving.setProfile(profile);

        SavingProduct product = this.savingProductService.getOne(dto.getSavingProductId()).get();
        saving.setProduct(product);

        saving.setInterestAccrualFrequency(product.getInterestAccrualFrequency());
        saving.setInterestPostingFrequency(product.getPostingFrequency());
        saving.setCapitalized(product.isCapitalized());
        saving.setDepositAmountMin(product.getDepositAmountMin());
        saving.setDepositAmountMax(product.getDepositAmountMax());
        saving.setWithdrawalAmountMin(product.getWithdrawalAmountMin());
        saving.setWithdrawalAmountMax(product.getWithdrawalAmountMax());
        saving.setManagementFeeFrequency(product.getManagementFeeFrequency());

        User savingOfficer = this.userService.findById(dto.getSavingOfficerId()).get();
        saving.setSavingOfficer(savingOfficer);
        return saving;
    }

    public SavingDetailsDto mapToDto(Saving saving) {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.addMappings(new SavingToDtoMap());
        SavingDetailsDto savingDetailsDto = modelMapper.map(saving, SavingDetailsDto.class);
        savingDetailsDto.setSavingOfficerName(String.format("%s %s", saving.getSavingOfficer().getFirstName(), saving.getSavingOfficer().getLastName()));

        if (saving.getAccounts() != null && !saving.getAccounts().isEmpty()) {
            Account savingAccount = this.savingAccountingService.getAccount(saving.getAccounts(), SavingAccountRuleType.SAVING);
            BigDecimal savingAccountBalance = this.savingService.getSavingAccountBalance(savingAccount, DateHelper.getLocalDateTimeNow());
            savingDetailsDto.setSavingBalance(savingAccountBalance);

            Account interestAccount = this.savingAccountingService.getAccount(saving.getAccounts(), SavingAccountRuleType.INTEREST);
            BigDecimal interestAccountBalance = this.savingService.getSavingAccountBalance(interestAccount, DateHelper.getLocalDateTimeNow());
            savingDetailsDto.setAccruedInterest(interestAccountBalance);
        }

        return savingDetailsDto;
    }

    public Saving zip(Saving saving, SavingDto dto) {
        Saving zippedSaving = this.mapToEntity(dto);
        zippedSaving.setId(saving.getId());
        zippedSaving.setCreatedAt(saving.getCreatedAt());
        zippedSaving.setCreatedBy(saving.getCreatedBy());
        zippedSaving.setStatus(saving.getStatus());
        zippedSaving.setBranch(saving.getBranch());
        return zippedSaving;
    }

}
