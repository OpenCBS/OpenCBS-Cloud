package com.opencbs.core.controllers.profiles;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.mappers.AccountMapper;
import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.profiles.Company;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.dto.CompanyDetailDto;
import com.opencbs.core.dto.CompanyDto;
import com.opencbs.core.dto.profiles.ProfileAccountDto;
import com.opencbs.core.dto.profiles.ProfileDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.mappers.CompanyMapper;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.dto.RequestDto;
import com.opencbs.core.request.serivce.MakerCheckerWorker;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.core.services.CompanyService;
import com.opencbs.core.validators.CompanyDtoValidator;
import com.opencbs.core.validators.CompanyValidator;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/profiles/companies")
@SuppressWarnings("unused")
@RequiredArgsConstructor
public class CompanyController extends BaseController {

    private final CompanyService companyService;
    private final CompanyDtoValidator validator;
    private final CompanyMapper companyMapper;
    private final AccountMapper accountMapper;
    private final CompanyValidator companyValidator;
    private final MakerCheckerWorker makerCheckerWorker;


    @GetMapping(value = "/{id}")
    public CompanyDetailDto get(@PathVariable long id) throws Exception {
        return this.companyService.findOne(id, UserHelper.getCurrentUser())
                .map(this.companyMapper::mapEntityToDto)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Company not found (ID=%d).", id)));
    }

    @GetMapping(value = "/lookup")
    public Page<CompanyDetailDto> get(@RequestParam(value = "search", required = false) String query, Pageable pageable) {
        Page<Company> companyPage = this.companyService.search(query, pageable);
        List<CompanyDetailDto> companyDetailDtoPage = companyPage.getContent()
                .stream()
                .map(this.companyMapper::mapEntityToDto)
                .collect(Collectors.toList());
        return new PageImpl<>(companyDetailDtoPage, pageable, companyPage.getTotalElements());
    }

    @PermissionRequired(name = "MAKER_FOR_COMPANY", moduleType = ModuleType.MAKER_CHECKER, description = "")
    @PostMapping()
    public RequestDto post(@RequestBody CompanyDto companyDto) throws Exception {
        this.validator.validate(companyDto);
        Request request = this.makerCheckerWorker.create(RequestType.COMPANY_CREATE, companyDto);
        RequestDto detailsDto = new RequestDto();
        detailsDto.setId(request.getId());
        return detailsDto;
    }

    @PermissionRequired(name = "MAKER_FOR_COMPANY", moduleType = ModuleType.MAKER_CHECKER, description = "")
    @PutMapping(value = "/{id}")
    public RequestDto put(@PathVariable long id,
                          @RequestBody CompanyDto companyDto) throws Exception {
        companyDto.setId(id);
        this.validator.validate(companyDto);
        Request request = this.makerCheckerWorker.create(RequestType.COMPANY_EDIT, companyDto);
        RequestDto detailsDto = new RequestDto();
        detailsDto.setId(request.getId());
        return detailsDto;
    }

    @PostMapping(value = "/{id}/account")
    public CompanyDetailDto createCurrentAccount(@PathVariable long id,
                                                 @RequestParam("currencyId") long currencyId) throws ResourceNotFoundException {
        Company company = this.companyService.getCompany(id);
        return this.companyMapper.mapEntityToDto(this.companyService.createCurrentAccount(company, currencyId, UserHelper.getCurrentUser()));

    }

    @GetMapping(value = "/{id}/accounts")
    public List<ProfileAccountDto> getCurrentAccounts(@PathVariable long id) throws ResourceNotFoundException {
        Company company = this.companyService.getCompany(id);
        Set<Account> accounts = company.getCurrentAccounts();
        return accounts
                .stream()
                .map(this.accountMapper::accountToProfileDto)
                .peek(x -> x.setBalance(this.companyService.getBalance(x.getId())))
                .collect(Collectors.toList());
    }

    @PostMapping(value = "/{id}/members/add/{memberId}")
    public CompanyDetailDto addMember(@PathVariable long id,
                                      @PathVariable(name = "memberId") long memberId) throws ResourceNotFoundException {
        Company company = this.companyService.getCompany(id);
        this.companyValidator.validateAddMembers(memberId, company);
        return this.companyMapper.mapEntityToDto(this.companyService.addMember(company, memberId));
    }

    @PostMapping(value = "/{id}/members/remove/{memberId}")
    public CompanyDetailDto removeMember(@PathVariable long id,
                                         @PathVariable(name = "memberId") long memberId) throws ResourceNotFoundException {
        Company company = this.companyService.getCompany(id);
        this.companyValidator.validateRemoveMembers(memberId, company);
        return this.companyMapper.mapEntityToDto(this.companyService.removeMember(company, memberId));
    }

    @GetMapping(value = "{companyId}/members/lookup")
    public Page<ProfileDto> getAllPersonsWithoutDuplicate(@PathVariable(name = "companyId") long companyId,
                                                          @RequestParam(value = "search", required = false) String search, Pageable pageable) {
        Company company = this.companyService.getCompany(companyId);
        Page<Profile> profiles = this.companyService.getPersons(company, search, pageable);
        ModelMapper mapper = new ModelMapper();
        return profiles.map(x -> mapper.map(x, ProfileDto.class));
    }

}
