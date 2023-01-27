package com.opencbs.core.controllers;

import com.opencbs.core.domain.trees.Profession;
import com.opencbs.core.dto.TreeEntityDto;
import com.opencbs.core.dto.UpdateTreeEntityDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.ProfessionMapper;
import com.opencbs.core.services.ProfessionService;
import com.opencbs.core.validators.ProfessionDtoValidator;
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
@RequestMapping(value = "/api/professions")
public class ProfessionController {

    private final ProfessionService professionService;
    private final ProfessionMapper professionMapper;
    private final ProfessionDtoValidator professionDtoValidator;

    @Autowired
    public ProfessionController(ProfessionService professionService,
                                ProfessionMapper professionMapper,
                                ProfessionDtoValidator professionDtoValidator) {
        this.professionService = professionService;
        this.professionMapper = professionMapper;
        this.professionDtoValidator = professionDtoValidator;
    }

    @RequestMapping(method = GET)
    public List<TreeEntityDto> get() {
        List<Profession> professions = this.professionService.findAll();
        return professions
                .stream()
                .filter(x -> x.getParent() == null)
                .map(x -> this.professionMapper.map(x, professions))
                .collect(Collectors.toList());
    }

    @RequestMapping(value = "/{id}", method = GET)
    public TreeEntityDto get(@PathVariable long id) throws ResourceNotFoundException {
        Profession profession = this.professionService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Profession not found (ID=%d)", id)));
        return this.professionMapper.map(profession, this.professionService.findAll());
    }

    @RequestMapping(value = "/lookup", method = GET)
    public Page<Profession> get(@RequestParam(value = "search", required = false) String query, Pageable pageable) {
        return this.professionService.findBy(query, pageable);
    }

    @RequestMapping(method = POST)
    public TreeEntityDto post(@RequestBody UpdateTreeEntityDto updateProfessionDto) throws Exception {
        this.professionDtoValidator.validate(updateProfessionDto);
        Profession profession = this.professionMapper.map(updateProfessionDto);
        profession = this.professionService.create(profession);
        return this.professionMapper.map(profession, new ArrayList<>());
    }

    @RequestMapping(value = "/{id}", method = PUT)
    public TreeEntityDto put(@PathVariable long id, @RequestBody UpdateTreeEntityDto updateProfessionDto) throws Exception {
        Profession profession = this.professionService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Profession not found (ID=%d)", id)));
        updateProfessionDto.setId(id);
        this.professionDtoValidator.validate(updateProfessionDto);
        profession = this.professionMapper.zip(profession, updateProfessionDto);
        profession = this.professionService.update(profession);
        return this.professionMapper.map(profession, this.professionService.findAll());
    }
}
