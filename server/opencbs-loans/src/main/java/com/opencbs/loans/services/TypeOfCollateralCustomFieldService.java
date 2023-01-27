package com.opencbs.loans.services;

import com.opencbs.core.services.customFields.CustomFieldService;
import com.opencbs.loans.domain.customfields.CollateralCustomFieldValue;
import com.opencbs.loans.domain.customfields.TypeOfCollateralCustomField;
import com.opencbs.loans.repositories.TypeOfCollateralCustomFieldRepository;
import com.opencbs.loans.repositories.TypeOfCollateralCustomFieldValueRepository;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class TypeOfCollateralCustomFieldService extends CustomFieldService<TypeOfCollateralCustomField,
        CollateralCustomFieldValue,
        TypeOfCollateralCustomFieldRepository,
        TypeOfCollateralCustomFieldValueRepository> {

    private final TypeOfCollateralCustomFieldRepository typeOfCollateralCustomFieldRepository;


    @Autowired
    public TypeOfCollateralCustomFieldService(TypeOfCollateralCustomFieldRepository repository,
                                              TypeOfCollateralCustomFieldValueRepository customFieldValueRepository) {
        super(repository, customFieldValueRepository);
        this.typeOfCollateralCustomFieldRepository = repository;
    }

    @Transactional
    public Optional<TypeOfCollateralCustomField> findOne(long id) {
        return Optional.ofNullable(this.typeOfCollateralCustomFieldRepository.findOne(id));
    }

    public Optional<TypeOfCollateralCustomField> findBySectionIdAndName(long sectionId, @NonNull String name) {
        return typeOfCollateralCustomFieldRepository.findOneBySectionIdAndName(sectionId, name);
    }
}
