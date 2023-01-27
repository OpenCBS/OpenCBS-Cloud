package com.opencbs.core.controllers;

import com.opencbs.core.dto.LookTypeDto;
import com.opencbs.core.services.LookUpTypeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/api/lookup-type")
public class LookTypeController {

    private final LookUpTypeService lookUpTypeService;

    public LookTypeController(LookUpTypeService lookUpTypeService) {
        this.lookUpTypeService = lookUpTypeService;
    }

    @GetMapping
    public List<LookTypeDto> getLookUp() {
        return this.lookUpTypeService.getLookUps();
    }
}
