package com.opencbs.savings.worker.impl;

import com.opencbs.core.accounting.services.TillService;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.till.Till;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.UserService;
import com.opencbs.savings.domain.Saving;
import com.opencbs.savings.dto.OperationSavingDto;
import com.opencbs.savings.dto.SavingDetailsDto;
import com.opencbs.savings.mappers.SavingMapper;
import com.opencbs.savings.services.SavingService;
import com.opencbs.savings.services.SavingWorker;
import com.opencbs.savings.validators.SavingValidator;
import com.opencbs.savings.validators.TillSavingValidator;
import com.opencbs.savings.worker.TillWorker;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Slf4j
@Service
public class TillWorkerImpl implements TillWorker {

    private final UserService userService;
    private final TillService tillService;
    private final SavingWorker savingWorker;
    private final SavingService savingService;
    private final SavingValidator savingValidator;
    private final SavingMapper savingMapper;
    private final TillSavingValidator tillSavingValidator;

    @Autowired
    public TillWorkerImpl(@NonNull UserService userService,
                          @NonNull TillService tillService,
                          @NonNull SavingWorker savingWorker,
                          @NonNull SavingValidator savingValidator,
                          @NonNull SavingService savingService,
                          @NonNull SavingMapper savingMapper,
                          @NonNull TillSavingValidator tillSavingValidator) {
        this.userService = userService;
        this.tillService = tillService;
        this.savingWorker = savingWorker;
        this.savingService = savingService;
        this.savingValidator = savingValidator;
        this.savingMapper = savingMapper;
        this.tillSavingValidator = tillSavingValidator;
    }

    @Override
    @Transactional
    public Long depositToSaving(@NonNull Long tillId, @NonNull OperationSavingDto dto) {
        Till till = this.getTill(tillId);
        Saving saving = this.savingService.findById(dto.getSavingId());
        this.savingValidator.validateDepositAmount(dto.getAmount(), saving);
        User currentUser = userService.getCurrentUser();
        this.tillService.deposit(till, dto, userService.getCurrentUser());
        return this.savingWorker.deposit(saving, dto.getAmount(), DateHelper.getLocalDateTimeNow(), currentUser).getId();
    }

    @Override
    @Transactional
    public Long withdrawFromSaving(Long tillId, OperationSavingDto dto, User currentUser) {
        Saving saving = this.savingService.findById(dto.getSavingId());
        this.savingValidator.validateWithdrawAmount(dto.getAmount(), saving);
        SavingDetailsDto savingDetailsDto = this.savingMapper.mapToDto(this.savingWorker.withdraw(saving, dto.getAmount(), DateHelper.getLocalDateTimeNow(), currentUser));
        this.tillSavingValidator.validateOperationSaving(dto);
        Till till = this.getTill(tillId);
        this.tillService.withdraw(till, dto, currentUser);

        return savingDetailsDto.getId();
    }

    private Till getTill(Long id) throws ResourceNotFoundException {
        return this.tillService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Till not found (ID=%d).", id)));
    }
}
