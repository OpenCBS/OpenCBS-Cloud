package com.opencbs.core.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.TransactionTemplate;
import com.opencbs.core.dto.TransactionTemplateDto;
import com.opencbs.core.services.TransactionTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.util.Assert;

import java.util.Optional;

@RequiredArgsConstructor
@Validator
public class TransactionTemplateValidator {

    private final TransactionTemplateService transactionTemplateService;

    private void validate(TransactionTemplateDto transactionTemplateDto) {
        Assert.notNull(transactionTemplateDto.getName(), "Name is required.");
        Assert.isTrue(transactionTemplateDto.getDebitAccounts().size() == 1
                || transactionTemplateDto.getCreditAccounts().size() == 1, "No more than one account must be used");
    }

    public void validateOnCreate(TransactionTemplateDto transactionTemplateDto) {
        this.validate(transactionTemplateDto);
        Assert.isTrue(!this.transactionTemplateService.findByName(transactionTemplateDto.getName()).isPresent(), "Name already taken");
    }

    public void validateOnUpdate(TransactionTemplateDto transactionTemplateDto, Long id) {
        this.validate(transactionTemplateDto);
        Optional<TransactionTemplate> transactionTemplate = this.transactionTemplateService.findByName(transactionTemplateDto.getName());
        Assert.isTrue(!transactionTemplate.isPresent() || transactionTemplate.get().getId().equals(id), "Name already taken");
    }
}
