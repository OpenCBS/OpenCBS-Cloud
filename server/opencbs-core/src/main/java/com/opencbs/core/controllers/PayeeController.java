package com.opencbs.core.controllers;

import com.opencbs.core.domain.Payee;
import com.opencbs.core.dto.PayeeDetailsDto;
import com.opencbs.core.dto.PayeeDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.PayeeMapper;
import com.opencbs.core.services.PayeeService;
import com.opencbs.core.validators.PayeeValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

@RestController
@RequestMapping(value = "/api/payees")
public class PayeeController extends BaseController {

    private final PayeeService payeeService;
    private final PayeeValidator payeeValidator;
    private final PayeeMapper payeeMapper;

    @Autowired
    public PayeeController(PayeeService payeeService,
                           PayeeValidator payeeValidator,
                           PayeeMapper payeeMapper) {
        this.payeeService = payeeService;
        this.payeeValidator = payeeValidator;
        this.payeeMapper = payeeMapper;
    }

    @RequestMapping(method = POST)
    public PayeeDetailsDto post(@RequestBody PayeeDto dto) {
        this.payeeValidator.validateOnCreate(dto);
        Payee payee = this.payeeService.create(this.payeeMapper.mapToEntity(dto));
        return this.payeeMapper.mapToDto(payee);
    }

    @RequestMapping(value = "/{id}", method = PUT)
    public PayeeDetailsDto put(@PathVariable long id, @RequestBody PayeeDto dto) throws ResourceNotFoundException {
        this.payeeService
                .findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Payee not found (ID=%d).", id)));
        dto.setId(id);
        this.payeeValidator.validateOnUpdate(dto);
        Payee payee = this.payeeService.update(this.payeeMapper.mapToEntity(dto));
        return this.payeeMapper.mapToDto(payee);
    }

    @RequestMapping(value = "/{id}", method = GET)
    public Payee get(@PathVariable long id) throws ResourceNotFoundException {
        Payee payee = this.payeeService
                .findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Payee not found (ID=%d).", id)));
        return payee;
    }

    @RequestMapping(method = GET)
    public Page<PayeeDetailsDto> get(Pageable pageable) {
        Page<Payee> page = this.payeeService.findAll(pageable);
        List<PayeeDetailsDto> payeeDetailsDtos = page.getContent()
                .stream()
                .map(this.payeeMapper::mapToDto)
                .collect(Collectors.toList());
        return new PageImpl<>(payeeDetailsDtos, pageable, page.getTotalElements());
    }

    @RequestMapping(value = "/lookup", method = GET)
    public Page<PayeeDetailsDto> getLookup(Pageable pageable,
                                 @RequestParam(value = "search", required = false) String searchString) {
        return this.payeeService.getPayeeForLookup(pageable, searchString);
    }
}