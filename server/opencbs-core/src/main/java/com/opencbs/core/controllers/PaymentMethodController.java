package com.opencbs.core.controllers;

import com.opencbs.core.domain.trees.PaymentMethod;
import com.opencbs.core.dto.TreeEntityDto;
import com.opencbs.core.dto.UpdateTreeEntityDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.PaymentMethodMapper;
import com.opencbs.core.services.PaymentMethodService;
import com.opencbs.core.validators.PaymentMethodDtoValidator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/payment-methods")
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;
    private final PaymentMethodMapper paymentMethodMapper;
    private final PaymentMethodDtoValidator paymentMethodDtoValidator;

    public PaymentMethodController(PaymentMethodService paymentMethodService,
                                   PaymentMethodDtoValidator paymentMethodDtoValidator,
                                   PaymentMethodMapper paymentMethodMapper) {
        this.paymentMethodService = paymentMethodService;
        this.paymentMethodDtoValidator = paymentMethodDtoValidator;
        this.paymentMethodMapper = paymentMethodMapper;
    }

    @GetMapping
    public List<TreeEntityDto> get() {
        List<PaymentMethod> paymentMethods = this.paymentMethodService.findAll();
        return paymentMethods
                .stream()
                .filter(x -> x.getParent() == null)
                .map(x -> this.paymentMethodMapper.map(x, paymentMethods))
                .collect(Collectors.toList());
    }

    @GetMapping(value = "/{id}")
    public TreeEntityDto get(@PathVariable long id) throws ResourceNotFoundException {
        PaymentMethod paymentMethod = this.paymentMethodService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Payment Method not found (ID=%d)", id)));
        return this.paymentMethodMapper.map(paymentMethod, this.paymentMethodService.findAll());
    }

    @GetMapping(value = "/lookup")
    public Page<PaymentMethod> get(@RequestParam(value = "search", required = false) String search, Pageable pageable) {
        return this.paymentMethodService.findBy(search, pageable);
    }

    @PostMapping
    public TreeEntityDto create(@RequestBody UpdateTreeEntityDto updateTreeEntityDto) throws Exception {
        this.paymentMethodDtoValidator.validate(updateTreeEntityDto);
        PaymentMethod paymentMethod = this.paymentMethodMapper.map(updateTreeEntityDto);
        paymentMethod = this.paymentMethodService.create(paymentMethod);
        return this.paymentMethodMapper.map(paymentMethod, new ArrayList<>());
    }

    @PutMapping(value = "/{id}")
    public TreeEntityDto edit(@PathVariable long id, @RequestBody UpdateTreeEntityDto updateTreeEntityDto) throws Exception {
        PaymentMethod paymentMethod = this.paymentMethodService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Payment Method not found (ID=%d)", id)));
        updateTreeEntityDto.setId(id);
        this.paymentMethodDtoValidator.validate(updateTreeEntityDto);
        paymentMethod = this.paymentMethodMapper.zip(paymentMethod, updateTreeEntityDto);
        paymentMethod = this.paymentMethodService.update(paymentMethod);
        return this.paymentMethodMapper.map(paymentMethod, this.paymentMethodService.findAll());
    }
}
