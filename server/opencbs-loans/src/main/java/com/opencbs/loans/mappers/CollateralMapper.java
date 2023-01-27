package com.opencbs.loans.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.domain.customfields.CustomFieldSection;
import com.opencbs.core.domain.customfields.CustomFieldValue;
import com.opencbs.core.domain.enums.CustomFieldType;
import com.opencbs.core.dto.FieldValueDto;
import com.opencbs.core.dto.customfields.CustomFieldDto;
import com.opencbs.core.dto.customfields.CustomFieldValueDto;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.LookupService;
import com.opencbs.loans.domain.Collateral;
import com.opencbs.loans.domain.customfields.CollateralCustomFieldValue;
import com.opencbs.loans.domain.customfields.TypeOfCollateral;
import com.opencbs.loans.domain.customfields.TypeOfCollateralCustomField;
import com.opencbs.loans.dto.CollateralDetailDto;
import com.opencbs.loans.dto.CollateralDto;
import com.opencbs.loans.dto.CollateralUpdateDto;
import com.opencbs.loans.services.TypeOfCollateralService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Mapper
public class CollateralMapper {

    private final ModelMapper modelMapper;
    private final TypeOfCollateralCustomFieldMapper typeOfCollateralCustomFieldMapper;
    private final TypeOfCollateralService typeOfCollateralService;
    private final TypeOfCollateralMapper typeOfCollateralMapper;
    private final LookupService lookupService;

    @Autowired
    public CollateralMapper(ModelMapper modelMapper,
                            TypeOfCollateralCustomFieldMapper typeOfCollateralCustomFieldMapper,
                            TypeOfCollateralService typeOfCollateralService,
                            TypeOfCollateralMapper typeOfCollateralMapper,
                            LookupService lookupService) {
        this.modelMapper = modelMapper;
        this.typeOfCollateralCustomFieldMapper = typeOfCollateralCustomFieldMapper;
        this.typeOfCollateralService = typeOfCollateralService;
        this.typeOfCollateralMapper = typeOfCollateralMapper;
        this.lookupService = lookupService;
    }

    public CollateralDetailDto mapWithCustomFields(Collateral collateral) {
        CollateralDetailDto collateralDetailDto = new CollateralDetailDto();
        collateralDetailDto.setId(collateral.getId());
        collateralDetailDto.setName(collateral.getName());
        collateralDetailDto.setAmount(collateral.getAmount());
        collateralDetailDto.setTypeOfCollateral(typeOfCollateralMapper.map(collateral.getTypeOfCollateral()));

        List<CustomFieldValueDto> valueDtos = collateral.getTypeOfCollateral().getCustomFields()
                .stream()
                .map(cf -> {
                    CustomFieldDto customFieldDto = this.typeOfCollateralCustomFieldMapper.map(cf);
                    CustomFieldValueDto valueDto = new CustomFieldValueDto();
                    String value = collateral.getCustomFieldValues()
                            .stream()
                            .filter(cfv -> cf.getId().equals(cfv.getCustomField().getId()))
                            .map(CustomFieldValue::getValue)
                            .findFirst()
                            .orElse("");

                    valueDto.setValue(value);
                    if (cf.getFieldType().equals(CustomFieldType.LOOKUP) && !value.isEmpty()) {
                        valueDto.setValue(this.lookupService.getLookupValueObject(customFieldDto.getExtra().get("key").toString(), Long.valueOf(value)));
                    }
                    valueDto.setCustomField(customFieldDto);
                    return valueDto;
                })
                .collect(Collectors.toList());
        collateralDetailDto.setCustomFieldValues(valueDtos);
        return collateralDetailDto;
    }

    public CollateralDto mapToDto(Collateral collateral) {
        CollateralDto map = this.modelMapper.map(collateral, CollateralDto.class);
        map.setDeleted(map.getClosedAt() != null);
        return map;
    }

    public Collateral mapToEntity(CollateralUpdateDto collateralUpdateDto, User currentUser) {
        Collateral collateral = new Collateral();

        List<CollateralCustomFieldValue> collateralCustomFieldValueList = this.getAllCustomFields()
                .stream()
                .map(ccf -> {
                    String value = collateralUpdateDto.getFieldValues()
                            .stream()
                            .filter(fv -> ccf.getId().equals(fv.getFieldId()))
                            .findFirst()
                            .map(FieldValueDto::getValue)
                            .orElse("");
                    CollateralCustomFieldValue collateralCustomFieldValue = new CollateralCustomFieldValue();
                    collateralCustomFieldValue.setCollateral(collateral);
                    collateralCustomFieldValue.setCustomField(ccf);
                    collateralCustomFieldValue.setValue(value);
                    collateralCustomFieldValue.setCreatedAt(DateHelper.getLocalDateTimeNow());
                    collateralCustomFieldValue.setCreatedBy(currentUser);
                    return collateralCustomFieldValue;
                })
                .collect(Collectors.toList());
        collateral.setId(collateralUpdateDto.getId());
        collateral.setName(collateralUpdateDto.getName());
        collateral.setAmount(collateralUpdateDto.getAmount());
        TypeOfCollateral typeOfCollateral = typeOfCollateralService.findOne(collateralUpdateDto.getTypeOfCollateralId()).get();
        collateral.setTypeOfCollateral(typeOfCollateral);
        collateral.setCustomFieldValues(collateralCustomFieldValueList);

        return collateral;
    }

    public Collateral zip(Collateral collateral, CollateralUpdateDto collateralUpdateDto) {
        Collateral zippedCollateral = this.modelMapper.map(collateral, Collateral.class);
        List<CollateralCustomFieldValue> newValues = this.getAllCustomFields()
                .stream()
                .map(cf -> {
                    // Find out new value.
                    Optional<String> newValue = collateralUpdateDto.getFieldValues()
                            .stream()
                            .filter(v -> cf.getId().equals(v.getFieldId()))
                            .findFirst()
                            .map(FieldValueDto::getValue);
                    // Find out existing value.
                    Optional<CollateralCustomFieldValue> existingValue = collateral.getCustomFieldValues()
                            .stream()
                            .filter(cfv -> cf.getId().equals(cfv.getCustomField().getId()))
                            .findFirst();

                    CollateralCustomFieldValue result;
                    if (!newValue.isPresent() && !existingValue.isPresent()) {
                        result = new CollateralCustomFieldValue();
                        result.setValue("");
                        result.setCustomField(cf);
                    } else if (newValue.isPresent() && !existingValue.isPresent()) {
                        result = new CollateralCustomFieldValue();
                        result.setValue(newValue.get());
                        result.setCustomField(cf);
                    } else if (!newValue.isPresent()) {
                        result = existingValue.get();
                    } else {
                        result = existingValue.get();
                        result.setValue(newValue.get());
                    }

                    result.setCollateral(zippedCollateral);
                    return result;
                })
                .collect(Collectors.toList());

        zippedCollateral.getCustomFieldValues().clear();
        zippedCollateral.getCustomFieldValues().addAll(newValues);
        zippedCollateral.setCreatedBy(collateral.getCreatedBy());
        zippedCollateral.setName(collateralUpdateDto.getName());
        zippedCollateral.setAmount(collateralUpdateDto.getAmount());
        TypeOfCollateral typeOfCollateral = typeOfCollateralService.findOne(collateralUpdateDto.getTypeOfCollateralId()).get();
        collateral.setTypeOfCollateral(typeOfCollateral);
        return zippedCollateral;
    }

    private List<TypeOfCollateralCustomField> getAllCustomFields() {
        return this.typeOfCollateralService.findAll()
                .stream()
                .sorted(Comparator.comparingInt(CustomFieldSection::getOrder))
                .flatMap(s -> s.getCustomFields().stream().sorted(Comparator.comparingInt(CustomField::getOrder)))
                .collect(Collectors.toList());
    }
}
