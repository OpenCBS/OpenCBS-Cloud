package com.opencbs.loans.controllers.loanapplications;

import com.opencbs.core.dto.TreeEntityDto;
import com.opencbs.core.dto.UpdateTreeEntityDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.loans.domain.trees.LoanPurpose;
import com.opencbs.loans.mappers.LoanPurposeMapper;
import com.opencbs.loans.services.LoanPurposeService;
import com.opencbs.loans.validators.LoanPurposeValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

@RestController
@RequestMapping(value = "/api/loan-purposes")
@SuppressWarnings("/unused/")
public class LoanPurposeController {

    private final LoanPurposeService loanPurposeService;
    private final LoanPurposeMapper loanPurposeMapper;
    private final LoanPurposeValidator loanPurposeValidator;

    @Autowired
    public LoanPurposeController(
            LoanPurposeService loanPurposeService,
            LoanPurposeMapper loanPurposeMapper,
            LoanPurposeValidator loanPurposeValidator) {
        this.loanPurposeService = loanPurposeService;
        this.loanPurposeMapper = loanPurposeMapper;
        this.loanPurposeValidator = loanPurposeValidator;
    }

    @RequestMapping(method = GET)
    public List<TreeEntityDto> get() {
        List<LoanPurpose> loanPurposes = this.loanPurposeService.findAll();
        return loanPurposes
                .stream()
                .filter(x -> x.getParent() == null)
                .map(x -> this.loanPurposeMapper.map(x, loanPurposes))
                .collect(Collectors.toList());
    }

    @RequestMapping(value = "/lookup", method = GET)
    public Page<LoanPurpose> get(@RequestParam(value = "search", required = false) String query, Pageable pageable) {
        return this.loanPurposeService.findBy(query, pageable);
    }

    @RequestMapping(path = "/{id}", method = GET)
    public TreeEntityDto get(@PathVariable long id) throws ResourceNotFoundException {
        LoanPurpose loanPurpose = this.loanPurposeService
                    .findOne(id)
                    .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan purpose not found (ID=%d).", id)));
        return this.loanPurposeMapper.map(loanPurpose, this.loanPurposeService.findAll());
    }

    @RequestMapping(method = POST)
    public TreeEntityDto post(@RequestBody UpdateTreeEntityDto updateTreeEntityDto) throws Exception {
        this.loanPurposeValidator.validate(updateTreeEntityDto);
        LoanPurpose loanPurpose = this.loanPurposeMapper.map(updateTreeEntityDto);
        loanPurpose = this.loanPurposeService.create(loanPurpose);
        return this.loanPurposeMapper.map(loanPurpose, new ArrayList<>());
    }

    @RequestMapping(path = "/{id}", method = PUT)
    public TreeEntityDto put(@PathVariable long id, @RequestBody UpdateTreeEntityDto updateTreeEntityDto) throws Exception {
        LoanPurpose loanPurpose = this.loanPurposeService
                .findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan purpose not found(ID=%d).", id)));
        updateTreeEntityDto.setId(id);
        this.loanPurposeValidator.validate(updateTreeEntityDto);
        loanPurpose = this.loanPurposeMapper.zip(loanPurpose, updateTreeEntityDto);
        loanPurpose = this.loanPurposeService.update(loanPurpose);

        return this.loanPurposeMapper.map(loanPurpose, this.loanPurposeService.findAll());
    }
}
