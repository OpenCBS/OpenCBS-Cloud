package com.opencbs.loans.controllers.loanapplications;

import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.dto.UpdateCustomFieldSectionDto;
import com.opencbs.core.dto.customfields.CustomFieldSectionDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.loans.domain.customfields.TypeOfCollateral;
import com.opencbs.loans.mappers.TypeOfCollateralMapper;
import com.opencbs.loans.services.TypeOfCollateralService;
import com.opencbs.loans.validators.TypeOfCollateralDtoValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

@RestController
@RequestMapping(value = "/api/types-of-collateral")
@SuppressWarnings("unused")
public class TypeOfCollateralController extends BaseController {

    private final TypeOfCollateralService typeOfCollateralService;

    private final TypeOfCollateralMapper typeOfCollateralMapper;

    private final TypeOfCollateralDtoValidator typeOfCollateralDtoValidator;

    @Autowired
    public TypeOfCollateralController(
            TypeOfCollateralService typeOfCollateralService,
            TypeOfCollateralMapper typeOfCollateralMapper,
            TypeOfCollateralDtoValidator typeOfCollateralDtoValidator) {
        this.typeOfCollateralService = typeOfCollateralService;
        this.typeOfCollateralMapper = typeOfCollateralMapper;
        this.typeOfCollateralDtoValidator = typeOfCollateralDtoValidator;
    }

    @RequestMapping(method = GET)
    public List<CustomFieldSectionDto> get() {
        return this.typeOfCollateralService
                .findAll()
                .stream()
                .map(this.typeOfCollateralMapper::map)
                .collect(Collectors.toList());
    }

    @RequestMapping(value = "/{id}", method = GET)
    public CustomFieldSectionDto get(@PathVariable long id) throws ResourceNotFoundException {
        return this.typeOfCollateralService.findOne(id)
                .map(this.typeOfCollateralMapper::map)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Type of collateral not found (ID=%d).", id)));
    }

    @RequestMapping(method = POST)
    public CustomFieldSectionDto post(@RequestBody UpdateCustomFieldSectionDto sectionDto) {
        this.typeOfCollateralDtoValidator.validate(sectionDto);
        TypeOfCollateral typeOfCollateral = new TypeOfCollateral();
        typeOfCollateral = this.typeOfCollateralMapper.zip(typeOfCollateral, sectionDto);
        typeOfCollateral = this.typeOfCollateralService.create(typeOfCollateral);
        return this.typeOfCollateralMapper.map(typeOfCollateral);
    }

    @RequestMapping(value = "/{id}", method = PUT)
    public CustomFieldSectionDto put(@PathVariable long id, @RequestBody UpdateCustomFieldSectionDto sectionDto) throws ResourceNotFoundException {
        TypeOfCollateral typeOfCollateral = this.typeOfCollateralService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Type of collateral not found (ID=%d).", id)));

        this.typeOfCollateralDtoValidator.validateOnUpdate(sectionDto, typeOfCollateral);

        int oldOrder = typeOfCollateral.getOrder();
        typeOfCollateral = this.typeOfCollateralMapper.zip(typeOfCollateral, sectionDto);

        if (oldOrder == typeOfCollateral.getOrder()) {
            this.typeOfCollateralService.update(typeOfCollateral);
        } else {
            this.typeOfCollateralService.updateWithOrder(typeOfCollateral, oldOrder);
        }

        return this.typeOfCollateralMapper.map(typeOfCollateral);
    }
}
