package com.opencbs.core.services.customFields;

import com.opencbs.core.domain.customfields.PersonCustomFieldSection;
import com.opencbs.core.repositories.customFields.PersonCustomFieldSectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PersonCustomFieldSectionService extends CustomFieldSectionService<PersonCustomFieldSection, PersonCustomFieldSectionRepository> {

    @Autowired
    public PersonCustomFieldSectionService(PersonCustomFieldSectionRepository repository) {
        super(repository);
    }
}
