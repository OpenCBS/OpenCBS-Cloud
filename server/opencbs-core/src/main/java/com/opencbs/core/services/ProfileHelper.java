package com.opencbs.core.services;

import com.opencbs.core.domain.profiles.Profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfileHelper {

    private static String EMAIL_CUSTOM_FIELD_CODE = "email";

    @Lazy
    @Autowired
    private CompanyService companyService;

    @Lazy
    @Autowired
    private PersonService personService;

    @Lazy
    @Autowired
    private GroupService groupService;


    public Optional<String> getEmailByProfile(Profile profile) {
        if (profile.getType().compareTo("PERSON")==0) {
            return this.personService.getCustomValueByCode(profile, EMAIL_CUSTOM_FIELD_CODE);
        }

        if (profile.getType().compareTo("COMPANY")==0) {
            return this.companyService.getCustomValueByCode(profile, EMAIL_CUSTOM_FIELD_CODE);
        }

        /// For future
        //if (profile instanceof Group) {
        //    return this.groupService.getCustomValueByCode((Group)profile, EMAIL_CUSTOM_FIELD_CODE);
        //}

        throw new IllegalArgumentException(String.format("Profile can be Company, Person or Group types"));
    }
}
