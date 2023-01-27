package com.opencbs.core.services.customFields;

import com.opencbs.core.domain.customfields.PersonCustomField;
import com.opencbs.core.domain.customfields.PersonCustomFieldValue;
import com.opencbs.core.repositories.customFields.PersonCustomFieldRepository;
import com.opencbs.core.repositories.customFields.PersonCustomFieldValueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PersonCustomFieldService extends CustomFieldService<PersonCustomField,
        PersonCustomFieldValue,
        PersonCustomFieldRepository,
        PersonCustomFieldValueRepository> {

    @Autowired
    public PersonCustomFieldService(PersonCustomFieldRepository personCustomFieldRepository, PersonCustomFieldValueRepository personCustomValueRepository) {
        super(personCustomFieldRepository, personCustomValueRepository);
    }
}
