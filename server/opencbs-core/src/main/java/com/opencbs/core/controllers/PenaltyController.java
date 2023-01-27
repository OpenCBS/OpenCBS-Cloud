package com.opencbs.core.controllers;

import com.opencbs.core.domain.Penalty;
import com.opencbs.core.dto.penalty.PenaltyCreateDto;
import com.opencbs.core.dto.penalty.PenaltyInfoDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.PenaltyMapper;
import com.opencbs.core.services.PenaltyService;
import com.opencbs.core.validators.PenaltyValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/api/penalties")
public class PenaltyController extends BaseController {

    private final PenaltyService penaltyService;
    private final PenaltyValidator penaltyValidator;
    private final PenaltyMapper penaltyMapper;


    @GetMapping
    public Page<PenaltyInfoDto> getAll(Pageable pageable){
        return this.penaltyService.findAll(pageable).map(this.penaltyMapper::mapToDto);
    }

    @GetMapping(value = "/{id}")
    public PenaltyInfoDto getOne(@PathVariable long id) throws ResourceNotFoundException {
        Penalty penalty = this.getEntity(id);
        return this.penaltyMapper.mapToDto(penalty);
    }

    @PostMapping
    public Long create(@RequestBody PenaltyCreateDto dto) {
        this.penaltyValidator.validate(dto);
        return this.penaltyService.create(this.penaltyMapper.mapToEntity(dto)).getId();
    }

    @PutMapping(value = "/{id}")
    public PenaltyInfoDto update(@PathVariable long id, @RequestBody PenaltyCreateDto dto) throws ResourceNotFoundException {
        Penalty penalty = this.getEntity(id);
        dto.setId(penalty.getId());
        this.penaltyValidator.validate(dto);
        return this.penaltyMapper.mapToDto(this.penaltyService.update(this.penaltyMapper.mapToEntity(dto)));
    }

    private Penalty getEntity(long id) {
        return this.penaltyService.get(id).orElseThrow(() -> new ResourceNotFoundException(String.format("Penalty not found (ID=%d).", id)));
    }
}