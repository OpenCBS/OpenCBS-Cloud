package com.opencbs.loans.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.Permission;
import com.opencbs.core.domain.Role;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.services.RoleService;
import com.opencbs.loans.domain.creditCommittee.CreditCommitteeAmountRange;
import com.opencbs.loans.dto.creditcommittee.CreditCommitteeAmountRangeUpdateDto;
import com.opencbs.loans.repositories.CreditCommitteeAmountRangeRepository;
import org.springframework.util.Assert;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Validator
public class CreditCommitteeAmountRangeValidator {

    private final RoleService roleService;
    private final CreditCommitteeAmountRangeRepository rangeRepository;

    public CreditCommitteeAmountRangeValidator(RoleService roleService, CreditCommitteeAmountRangeRepository rangeRepository) {
        this.roleService = roleService;
        this.rangeRepository = rangeRepository;
    }

    public void validate(CreditCommitteeAmountRangeUpdateDto dto) throws ResourceNotFoundException {
        Assert.notNull(dto.getRoleIds(), "Role ids can not be null");
        Assert.notEmpty(dto.getRoleIds(), "List can not be empty.");
        List<Long> ids = this.roleService.findAll().stream().map(x -> x.getId()).collect(Collectors.toList());
        for (Long id : dto.getRoleIds()) {
            Assert.isTrue(ids.contains(id), String.format("Role not found (ID=%d).", id));
        }

        Set<Permission> permissions = new HashSet<>();
        for (Long id : dto.getRoleIds()) {
            Role role = this.roleService.getOne(id).get();
            permissions.addAll(role.getPermissions());
        }
        Assert.isTrue(permissions.stream().anyMatch(x -> x.getName().equals(UserHelper.getPrimaryCommitteePermission())),
                "At least one role must contain the permission 'Primary Credit Committee Member");

        Assert.notNull(dto.getAmount(), "Amount is required.");
        Assert.isTrue(dto.getAmount().doubleValue() > 0, "Amount should be greater than zero.");
        if (!this.rangeRepository.findAll().isEmpty()) {
            CreditCommitteeAmountRange previous = this.rangeRepository.findTopByOrderByAmountDesc();
            Assert.isTrue(previous.getAmount().compareTo(dto.getAmount()) == -1,
                    String.format("Amount should be greater than %d.", Math.round(previous.getAmount().doubleValue())));
        }
    }

    public void validateOnUpdate(CreditCommitteeAmountRangeUpdateDto dto, CreditCommitteeAmountRange oldRange) {

        Assert.notNull(dto.getRoleIds(), "Role ids can not be null");
        Assert.notEmpty(dto.getRoleIds(), "List can not be empty.");
        List<Long> ids = this.roleService.findAll().stream().map(x -> x.getId()).collect(Collectors.toList());
        for (Long id : dto.getRoleIds()) {
            Assert.isTrue(ids.contains(id), String.format("Role not found (ID=%d).", id));
        }

        Assert.notNull(dto.getAmount(), "Amount is required.");
        Assert.isTrue(dto.getAmount().doubleValue() > 0, "Amount should be greater than zero.");

        BigDecimal oldAmount = this.rangeRepository.findOne(oldRange.getId()).getAmount();
        List<BigDecimal> amounts = this.rangeRepository.findAll().stream().map(x -> x.getAmount()).collect(Collectors.toList());
        Collections.sort(amounts);
        int index = amounts.indexOf(oldAmount);
        if (amounts.size() != 1) {
            if (index == 0) {
                Assert.isTrue(amounts.get(index + 1).compareTo(dto.getAmount()) == 1,
                        String.format("Amount should be between 0 and %d", Math.round(amounts.get(1).doubleValue())));
            } else if (index == amounts.size() - 1) {
                Assert.isTrue(amounts.get(amounts.size() - 2).compareTo(dto.getAmount()) == -1,
                        String.format("Amount should be greater than %d", Math.round(amounts.get(amounts.size() - 2).doubleValue())));
            } else {
                Assert.isTrue(amounts.get(index - 1).compareTo(dto.getAmount()) == -1 && amounts.get(index + 1).compareTo(dto.getAmount()) == 1,
                        String.format("Amount should be between %d and %d", Math.round(amounts.get(index - 1).doubleValue()), Math.round(amounts.get(index + 1).doubleValue())));
            }
        }
    }
}