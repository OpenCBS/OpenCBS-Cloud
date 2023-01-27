package com.opencbs.core.controllers.profiles;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.mappers.AccountMapper;
import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.profiles.Person;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.dto.PersonDetailDto;
import com.opencbs.core.dto.PersonDto;
import com.opencbs.core.dto.person.GetPersonDetailsDto;
import com.opencbs.core.dto.profiles.ProfileAccountDto;
import com.opencbs.core.dto.profiles.ProfilesDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.mappers.PersonMapper;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.dto.RequestDto;
import com.opencbs.core.request.serivce.MakerCheckerWorker;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.core.services.PersonService;
import com.opencbs.core.validators.PersonDtoValidator;
import com.opencbs.core.workers.ProfileWorker;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
@RequestMapping(value = "/api/profiles/people")
@SuppressWarnings("unused")
@RequiredArgsConstructor
public class PersonController extends BaseController {

    private final PersonService personService;
    private final PersonDtoValidator validator;
    private final PersonMapper personMapper;
    private final AccountMapper accountMapper;
    private final ProfileWorker profileWorker;
    private final MakerCheckerWorker makerCheckerWorker;


    @RequestMapping(value = "/{id}", method = GET)
    public GetPersonDetailsDto get(@PathVariable long id) throws ResourceNotFoundException {
        return this.personService
                .findOne(id, UserHelper.getCurrentUser())
                .map(this.personMapper::getMapEntityToDto)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Person not found (ID=%d).", id)));
    }

    @RequestMapping(value = "/lookup", method = GET)
    public Page<PersonDetailDto> get(@RequestParam(value = "search", required = false) String query, Pageable pageable) {
        Page<Person> personPage = this.personService.search(query, pageable);
        List<PersonDetailDto> personDetailPage = personPage.getContent()
                .stream()
                .map(this.personMapper::mapEntityToDto)
                .collect(Collectors.toList());
        return new PageImpl<>(personDetailPage, pageable, personPage.getTotalElements());
    }

    @PermissionRequired(name = "MAKER_FOR_PEOPLE", moduleType = ModuleType.MAKER_CHECKER, description = "")
    @RequestMapping(method = RequestMethod.POST)
    public RequestDto post(@RequestBody PersonDto personDto) throws Exception {
        this.validator.validate(personDto);
        Request request = this.makerCheckerWorker.create(RequestType.PEOPLE_CREATE, personDto);
        RequestDto detailsDto = new RequestDto();
        detailsDto.setId(request.getId());
        return  detailsDto;
    }

    @PermissionRequired(name = "MAKER_FOR_PEOPLE", moduleType = ModuleType.MAKER_CHECKER, description = "")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public RequestDto put(@PathVariable long id,
                          @RequestBody PersonDto personDto) throws Exception {
        personDto.setId(id);
        this.validator.validate(personDto);
        Request request = this.makerCheckerWorker.create(RequestType.PEOPLE_EDIT, personDto);
        RequestDto detailsDto = new RequestDto();
        detailsDto.setId(request.getId());
        return  detailsDto;
    }

    @RequestMapping(value = "/{id}/account", method = POST)
    public PersonDetailDto createCurrentAccount(@PathVariable long id,
                                                @RequestParam("currencyId") long currencyId) throws ResourceNotFoundException {
        Person person = this.personService.getPerson(id);
        return this.personMapper.mapEntityToDto(this.personService.createCurrentAccount(person, currencyId, UserHelper.getCurrentUser()));
    }

    @RequestMapping(value = "/{id}/accounts", method = GET)
    public List<ProfileAccountDto> getCurrentAccounts(@PathVariable long id) throws ResourceNotFoundException {
        Person person = this.personService.getPerson(id);
        Set<Account> accounts = person.getCurrentAccounts();
        return accounts
                .stream()
                .map(this.accountMapper::accountToProfileDto)
                .peek(x -> x.setBalance(this.personService.getBalance(x.getId()).setScale(2, BigDecimal.ROUND_HALF_EVEN)))
                .collect(Collectors.toList());
    }

    @GetMapping(path = "/{profileId}/links/profiles")
    public Collection<ProfilesDto> getRelatedProfiles(@PathVariable Long profileId, Pageable pageable) throws ResourceNotFoundException {
        Person person = this.personService.getPerson(profileId);
        Collection<Profile> profiles = profileWorker.getRelatedProfiles(person, pageable, UserHelper.getCurrentUser());
        ModelMapper mapper = new ModelMapper();
        return profiles.stream().map(x -> mapper.map(x, ProfilesDto.class)).unordered().collect(Collectors.toList());
    }
}
