package com.opencbs.core.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.customfields.CompanyCustomField;
import com.opencbs.core.domain.customfields.CompanyCustomFieldValue;
import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.domain.customfields.CustomFieldSection;
import com.opencbs.core.domain.enums.CustomFieldType;
import com.opencbs.core.domain.profiles.Company;
import com.opencbs.core.domain.profiles.CompanyMember;
import com.opencbs.core.domain.profiles.Person;
import com.opencbs.core.dto.CompanyDetailDto;
import com.opencbs.core.dto.CompanyDto;
import com.opencbs.core.dto.CompanyMembersDto;
import com.opencbs.core.dto.FieldValueDto;
import com.opencbs.core.dto.customfields.CustomFieldDto;
import com.opencbs.core.dto.customfields.CustomFieldValueDto;
import com.opencbs.core.dto.profiles.ProfileCustomFieldSectionDto;
import com.opencbs.core.mappers.customFields.CompanyCustomFieldMapper;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.serivce.RequestService;
import com.opencbs.core.services.customFields.CompanyCustomFieldSectionService;
import com.opencbs.core.services.PersonService;
import com.opencbs.core.workers.LookupWorker;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Mapper
public class CompanyMapper extends ProfileBaseMapper {

    private final CompanyCustomFieldSectionService companyCustomFieldSectionService;
    private final CompanyCustomFieldMapper companyCustomFieldMapper;
    private final PersonService personService;
    private final RequestService requestService;

    @Autowired
    public CompanyMapper(
            AttachmentMapper attachmentMapper,
            CompanyCustomFieldSectionService companyCustomFieldSectionService,
            CompanyCustomFieldMapper companyCustomFieldMapper,
            LookupWorker lookupWorker,
            PersonService personService,
            RequestService requestService) {
        super(attachmentMapper, lookupWorker);
        this.companyCustomFieldSectionService = companyCustomFieldSectionService;
        this.companyCustomFieldMapper = companyCustomFieldMapper;
        this.personService = personService;
        this.requestService = requestService;
    }

    public Company mapDtoToEntity(CompanyDto companyDto) {
        Company company = new Company();

        List<CompanyCustomFieldValue> companyCustomFieldValues = this.getCustomFieldValuesFromDto(companyDto, company);
        company.setId(companyDto.getId());
        company.setCustomFieldValues(companyCustomFieldValues);
        company.setAttachments(new ArrayList<>());
        return company;
    }

    public CompanyDetailDto mapEntityToDto(Company company) {
        ModelMapper mapper = new ModelMapper();
        mapper.addMappings(new PropertyMap<Company, CompanyDetailDto>() {
            @Override
            protected void configure() {
                skip().setCompanyMembers(null);
            }
        });
        CompanyDetailDto companyDetailDto = mapper.map(company, CompanyDetailDto.class);
        companyDetailDto.setCompanyMembers(new ArrayList<>());
        List<ProfileCustomFieldSectionDto> sections = this.companyCustomFieldSectionService
                .findAll()
                .stream()
                .map(s -> {
                    ProfileCustomFieldSectionDto dto = this.modelMapper.map(s, ProfileCustomFieldSectionDto.class);
                    List<CustomFieldValueDto> values = s.getCustomFields()
                            .stream().map(cf -> {
                                CustomFieldDto customFieldDto = this.companyCustomFieldMapper.map(cf);
                                CustomFieldValueDto valueDto = new CustomFieldValueDto();
                                Optional<CompanyCustomFieldValue> customFieldValue = company.getCustomFieldValues()
                                        .stream()
                                        .filter(cfv -> cf.getId().equals(cfv.getCustomField().getId()))
                                        .findFirst();
                                if (customFieldValue.isPresent()) {
                                    String value = customFieldValue.get().getValue();
                                    valueDto.setValue(value);
                                    valueDto.setStatus(customFieldValue.get().getStatus());
                                    if (cf.getFieldType().equals(CustomFieldType.LOOKUP) && !customFieldValue.get().getValue().isEmpty()) {
                                        valueDto.setValue(this.lookupWorker.getLookupValueObject(customFieldDto.getExtra().get("key").toString(), Long.valueOf(value)));
                                    }
                                } else {
                                    valueDto.setValue("");
                                }
                                valueDto.setCustomField(customFieldDto);
                                return valueDto;
                            })
                            .collect(Collectors.toList());
                    dto.setValues(values);
                    return dto;
                })
                .collect(Collectors.toList());
        companyDetailDto.setCustomFieldSections(sections);
        companyDetailDto.setAttachments(
                company.getAttachments()
                        .stream()
                        .map(this.attachmentMapper::mapToDto)
                        .collect(Collectors.toList())
        );
        companyDetailDto.setIsReadOnly(this.requestService.isActiveRequest(RequestType.COMPANY_EDIT, company.getId()));

        if (company.getCompanyMembers() != null) {
            List<CompanyMember> companyMembers =
                    company.getCompanyMembers().stream().filter(x -> x.getLeftDate() == null).collect(Collectors.toList());
            for (CompanyMember member : companyMembers) {
                Optional<Person> person = this.personService.findOne(member.getMember().getId());
                CompanyMembersDto companyMembersDto = new CompanyMembersDto();
                if (person.isPresent()) {
                    companyMembersDto.setName(person.get().getName());
                    companyMembersDto.setType(person.get().getType());
                }
                companyMembersDto.setId(member.getId());
                companyMembersDto.setCompanyId(company.getId());
                companyMembersDto.setMemberId(member.getMember().getId());
                companyMembersDto.setJoinDate(member.getJoinDate());
                companyMembersDto.setLeftDate(member.getLeftDate());
                companyDetailDto.getCompanyMembers().add(companyMembersDto);
            }

        }
        return companyDetailDto;
    }

    public Company zip(Company company, CompanyDto companyDto) {
        Company zippedCompany = new Company();
        this.modelMapper.map(company, zippedCompany);
        List<CompanyCustomFieldValue> newValues = this.getCustomFieldValuesFromDto(companyDto, zippedCompany);
        zippedCompany.setCustomFieldValues(newValues);
        zippedCompany.setAttachments(company.getAttachments());

        return zippedCompany;
    }

    private List<CompanyCustomField> getAllCustomFields() {
        return this.companyCustomFieldSectionService.findAll()
                .stream()
                .sorted(Comparator.comparingInt(CustomFieldSection::getOrder))
                .flatMap(s -> s.getCustomFields().stream().sorted(Comparator.comparingInt(CustomField::getOrder)))
                .collect(Collectors.toList());
    }

    private List<CompanyCustomFieldValue> getCustomFieldValuesFromDto(CompanyDto dto, Company company) {
        return this.getAllCustomFields()
                .stream()
                .map(f -> {
                    String value = dto.getFieldValues()
                            .stream()
                            .filter(v -> v.getFieldId() == f.getId())
                            .findFirst()
                            .map(FieldValueDto::getValue)
                            .orElse("");
                    CompanyCustomFieldValue customFieldValue = new CompanyCustomFieldValue();
                    customFieldValue.setCustomField(f);
                    customFieldValue.setValue(value);
                    customFieldValue.setOwner(company);
                    return customFieldValue;
                })
                .collect(Collectors.toList());
    }
}
