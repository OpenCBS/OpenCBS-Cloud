package com.opencbs.core.services;

import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.domain.customfields.PersonCustomFieldValue;
import com.opencbs.core.domain.profiles.Person;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.repositories.ProfileBaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PersonService extends ProfileBaseService<Person, PersonCustomFieldValue> {

    @Autowired
    public PersonService(ProfileBaseRepository<Person> profileRepository,
                         GlobalSettingsService globalSettingsService,
                         AccountService accountService,
                         CurrencyService currencyService,
                         CurrentAccountGenerator currentAccountGenerator) {
        super(profileRepository,
                globalSettingsService,
                accountService,
                currencyService,
                currentAccountGenerator);
    }

    @Override
    List<PersonCustomFieldValue> getProfileCustomFieldValues(Person person) {
        return person.getCustomFieldValues();
    }

    @Override
    void setProfileCustomFieldValues(Person person, List<PersonCustomFieldValue> values) {
        person.setCustomFieldValues(values);
    }

    public Person getPerson(long id) throws ResourceNotFoundException {
        return this.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Person not found (ID=%d).", id)));
    }
}
