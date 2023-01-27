package com.opencbs.core.controllers;

import com.opencbs.core.domain.EntryFee;
import com.opencbs.core.dto.CreateEntryFeeDto;
import com.opencbs.core.dto.EntryFeeMainDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.EntryFeeMapper;
import com.opencbs.core.services.EntryFeeService;
import com.opencbs.core.validators.EntryFeeValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/entry-fees")
@SuppressWarnings("unused")
public class EntryFeeController extends BaseController {
    private final EntryFeeService entryFeeService;
    private final EntryFeeValidator entryFeeValidator;
    private final EntryFeeMapper entryFeeMapper;

    @Autowired
    public EntryFeeController(EntryFeeService entryFeeService,
                              EntryFeeValidator entryFeeValidator,
                              EntryFeeMapper entryFeeMapper) {
        this.entryFeeService = entryFeeService;
        this.entryFeeValidator = entryFeeValidator;
        this.entryFeeMapper = entryFeeMapper;
    }

    @GetMapping
    public List<EntryFeeMainDto> getAll() {
        return this.entryFeeService.findAll().stream()
                .map(this.entryFeeMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @GetMapping(value = "/by-currency/{currencyId}")
    public List<EntryFeeMainDto> getByCurrency(@PathVariable Long currencyId){
        return this.entryFeeService.findAllByCurrency(currencyId).stream()
                .map(this.entryFeeMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @GetMapping(value = "/{id}")
    public EntryFeeMainDto get(@PathVariable long id) throws Exception {
        return this.entryFeeService.findOne(id)
                .map(this.entryFeeMapper::mapToDto)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Entry Fee not found(ID=%d).", id)));
    }

    @PostMapping
    public EntryFeeMainDto post(@RequestBody CreateEntryFeeDto dto) {
        this.entryFeeValidator.validate(dto);
        EntryFee entryFee = this.entryFeeMapper.mapToEntity(dto);
        return this.entryFeeMapper.mapToDto(this.entryFeeService.create(entryFee));
    }

    @PutMapping(value = "/{id}")
    public EntryFeeMainDto put(@PathVariable long id, @RequestBody CreateEntryFeeDto dto) throws ResourceNotFoundException {
        this.entryFeeService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Entry Fee not found(ID=%d).", id)));
        dto.setId(id);
        EntryFee entryFee = this.entryFeeMapper.mapToEntity(dto);
        this.entryFeeValidator.validate(dto);
        return this.entryFeeMapper.mapToDto(this.entryFeeService.update(entryFee));
    }
}
