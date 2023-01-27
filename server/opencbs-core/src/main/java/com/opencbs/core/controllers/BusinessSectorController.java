package com.opencbs.core.controllers;

import com.opencbs.core.domain.trees.BusinessSector;
import com.opencbs.core.dto.TreeEntityDto;
import com.opencbs.core.dto.UpdateTreeEntityDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.BusinessSectorMapper;
import com.opencbs.core.services.BusinessSectorService;
import com.opencbs.core.validators.BusinessSectorValidator;
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
@RequestMapping(value = "/api/business-sectors")
@SuppressWarnings("unused")
public class BusinessSectorController {

    private final BusinessSectorService businessSectorService;
    private final BusinessSectorMapper businessSectorMapper;
    private final BusinessSectorValidator businessSectorValidator;

    @Autowired
    public BusinessSectorController(BusinessSectorService businessSectorService,
                                    BusinessSectorMapper businessSectorMapper,
                                    BusinessSectorValidator businessSectorValidator) {
        this.businessSectorService = businessSectorService;
        this.businessSectorMapper = businessSectorMapper;
        this.businessSectorValidator = businessSectorValidator;
    }

    @RequestMapping(method = GET)
    public List<TreeEntityDto> get() {
        List<BusinessSector> businessSectors = this.businessSectorService.findAll();
        return businessSectors
                .stream()
                .filter(x -> x.getParent() == null)
                .map(x -> this.businessSectorMapper.map(x, businessSectors))
                .collect(Collectors.toList());
    }

    @RequestMapping(value = "/{id}", method = GET)
    public TreeEntityDto get(@PathVariable long id) throws Exception {
        BusinessSector businessSector = this.businessSectorService
                .findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Business sector not found (ID=%d).", id)));

        return this.businessSectorMapper.map(businessSector, this.businessSectorService.findAll());
    }

    @RequestMapping(value = "/lookup", method = GET)
    public Page<BusinessSector> get(@RequestParam(value = "search", required = false) String query, Pageable pageable) {
        return this.businessSectorService.findBy(query, pageable);
    }

    @RequestMapping(method = POST)
    public TreeEntityDto post(@RequestBody UpdateTreeEntityDto updateTreeEntityDto) throws Exception {
        businessSectorValidator.validate(updateTreeEntityDto);

        BusinessSector businessSector = this.businessSectorMapper.map(updateTreeEntityDto);
        businessSector = this.businessSectorService.create(businessSector);

        return this.businessSectorMapper.map(businessSector, new ArrayList<>());
    }

    @RequestMapping(value = "/{id}", method = PUT)
    public TreeEntityDto put(@PathVariable long id, @RequestBody UpdateTreeEntityDto updateTreeEntityDto) throws Exception {
        BusinessSector businessSector = this.businessSectorService
                .findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Business sector not found (ID=%d).", id)));
        updateTreeEntityDto.setId(id);
        businessSectorValidator.validate(updateTreeEntityDto);

        businessSector = this.businessSectorMapper.zip(businessSector, updateTreeEntityDto);
        businessSector = this.businessSectorService.update(businessSector);
        return this.businessSectorMapper.map(businessSector, this.businessSectorService.findAll());
    }
}
