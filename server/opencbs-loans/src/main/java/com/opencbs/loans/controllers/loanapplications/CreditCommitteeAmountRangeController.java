package com.opencbs.loans.controllers.loanapplications;

import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.loans.domain.creditCommittee.CreditCommitteeAmountRange;
import com.opencbs.loans.dto.creditcommittee.CreditCommitteeAmountRangeDto;
import com.opencbs.loans.dto.creditcommittee.CreditCommitteeAmountRangeUpdateDto;
import com.opencbs.loans.mappers.CreditCommitteeAmountRangeMapper;
import com.opencbs.loans.services.creditcommitteeservices.CreditCommitteeAmountRangeService;
import com.opencbs.loans.validators.CreditCommitteeAmountRangeValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/credit-committee-amount-ranges")
@SuppressWarnings("unused")
public class CreditCommitteeAmountRangeController extends BaseController {
    private final CreditCommitteeAmountRangeService creditCommitteeAmountRangeService;
    private final CreditCommitteeAmountRangeMapper creditCommitteeAmountRangeMapper;
    private final CreditCommitteeAmountRangeValidator validator;

    @Autowired
    public CreditCommitteeAmountRangeController(CreditCommitteeAmountRangeService creditCommitteeAmountRangeService,
                                                CreditCommitteeAmountRangeMapper creditCommitteeAmountRangeMapper,
                                                CreditCommitteeAmountRangeValidator validator) {
        this.creditCommitteeAmountRangeService = creditCommitteeAmountRangeService;
        this.creditCommitteeAmountRangeMapper = creditCommitteeAmountRangeMapper;

        this.validator = validator;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<CreditCommitteeAmountRangeDto> getAll() {
        List<CreditCommitteeAmountRangeDto> creditCommitteeAmountRangeDtos = this.creditCommitteeAmountRangeService.findAll()
                .stream()
                .map(this.creditCommitteeAmountRangeMapper::mapToDto)
                .collect(Collectors.toList());
        creditCommitteeAmountRangeDtos.sort(Comparator.comparing(CreditCommitteeAmountRangeDto::getMaxValue));
        return creditCommitteeAmountRangeDtos;
    }

    @RequestMapping(method = RequestMethod.POST)
    public CreditCommitteeAmountRangeDto post(@RequestBody CreditCommitteeAmountRangeUpdateDto dto) throws ResourceNotFoundException {
        this.validator.validate(dto);
        CreditCommitteeAmountRange creditCommitteeAmountRange = this.creditCommitteeAmountRangeMapper.mapToEntity(dto);
        return this.creditCommitteeAmountRangeMapper.mapToDto(this.creditCommitteeAmountRangeService.create(creditCommitteeAmountRange, UserHelper.getCurrentUser()));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public CreditCommitteeAmountRangeDto get(@PathVariable long id) throws Exception {
        CreditCommitteeAmountRange creditCommitteeAmountRange = this.creditCommitteeAmountRangeService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Credit committee amount range not found (ID=%d).", id)));
        return this.creditCommitteeAmountRangeMapper.mapToDto(creditCommitteeAmountRange);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public CreditCommitteeAmountRangeDto put(@PathVariable long id, @RequestBody CreditCommitteeAmountRangeUpdateDto dto) throws Exception {
        CreditCommitteeAmountRange oldRange = this.creditCommitteeAmountRangeService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Credit committee amount range not found (ID=%d).", id)));
        this.validator.validateOnUpdate(dto, oldRange);
        CreditCommitteeAmountRange creditCommitteeAmountRange = this.creditCommitteeAmountRangeMapper.zip(oldRange, dto);
        creditCommitteeAmountRange.setId(id);
        return this.creditCommitteeAmountRangeMapper.mapToDto(this.creditCommitteeAmountRangeService.update(creditCommitteeAmountRange));
    }
}
