package com.opencbs.core.services;

import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.domain.customfields.CompanyCustomFieldValue;
import com.opencbs.core.domain.enums.ProfileType;
import com.opencbs.core.domain.profiles.Company;
import com.opencbs.core.domain.profiles.CompanyMember;
import com.opencbs.core.domain.profiles.Person;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.repositories.ProfileBaseRepository;
import com.opencbs.core.repositories.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CompanyService extends ProfileBaseService<Company, CompanyCustomFieldValue> {

    private final PersonService personService;
    private final CompanyMemberService companyMemberService;
    private final ProfileRepository profileRepository;

    @Autowired
    public CompanyService(ProfileBaseRepository<Company> profileRepository,
                          GlobalSettingsService globalSettingsService,
                          AccountService accountService,
                          CurrencyService currencyService,
                          CurrentAccountGenerator currentAccountGenerator,
                          PersonService personService,
                          CompanyMemberService companyMemberService,
                          ProfileRepository profileRepository1) {
        super(profileRepository,
                globalSettingsService,
                accountService,
                currencyService,
                currentAccountGenerator);
        this.personService = personService;
        this.companyMemberService = companyMemberService;
        this.profileRepository = profileRepository1;
    }

    @Override
    List<CompanyCustomFieldValue> getProfileCustomFieldValues(Company company) {
        return company.getCustomFieldValues();
    }

    @Override
    void setProfileCustomFieldValues(Company company, List<CompanyCustomFieldValue> values) {
        company.setCustomFieldValues(values);
    }

    public Company addMember(Company company, Long memberId) {
        CompanyMember companyMember = new CompanyMember();
        Person person = this.personService.findOne(memberId).get();
        companyMember.setCompany(company);
        companyMember.setMember(person);
        companyMember.setJoinDate(DateHelper.getLocalDateTimeNow());
        companyMember.setLeftDate(null);
        this.companyMemberService.save(companyMember);
        company.getCompanyMembers().add(companyMember);
        return company;
    }

    public Company removeMember(Company company, Long memberId) {
        CompanyMember member = company.getCompanyMembers()
                .stream()
                .filter(x -> x.getMember().getId().equals(memberId) && x.getLeftDate() == null)
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Member not found (ID=%d).")));
        member.setLeftDate(DateHelper.getLocalDateTimeNow());
        this.companyMemberService.save(member);
        return company;
    }

    public Company getCompany(long id) throws ResourceNotFoundException {
        return this.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Company not found (ID=%d).", id)));
    }

    public Page<Profile> getPersons(Company company, String search, Pageable pageable) {
        List<Long> profileIds = new ArrayList<>();
        company.getCompanyMembers()
                .stream()
                .filter((x) -> x.getLeftDate() == null)
                .forEach((x) -> profileIds.add(x.getMember().getId()));
        return this.profileRepository.searchForCompany(ProfileType.PERSON, search, profileIds, pageable);
    }
}
