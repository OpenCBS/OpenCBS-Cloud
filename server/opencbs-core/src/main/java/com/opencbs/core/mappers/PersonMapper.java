package com.opencbs.core.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.domain.customfields.CustomFieldSection;
import com.opencbs.core.domain.customfields.PersonCustomField;
import com.opencbs.core.domain.customfields.PersonCustomFieldValue;
import com.opencbs.core.domain.enums.CustomFieldType;
import com.opencbs.core.domain.profiles.Person;
import com.opencbs.core.dto.FieldValueDto;
import com.opencbs.core.dto.PersonDetailDto;
import com.opencbs.core.dto.PersonDto;
import com.opencbs.core.dto.customfields.CustomFieldDto;
import com.opencbs.core.dto.customfields.CustomFieldValueDto;
import com.opencbs.core.dto.person.GetPersonDetailsDto;
import com.opencbs.core.dto.profiles.ProfileCustomFieldSectionDto;
import com.opencbs.core.mappers.customFields.PersonCustomFieldMapper;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.serivce.RequestService;
import com.opencbs.core.services.customFields.PersonCustomFieldSectionService;
import com.opencbs.core.workers.LookupWorker;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Mapper
public class PersonMapper extends ProfileBaseMapper {

    private final PersonCustomFieldSectionService personCustomFieldSectionService;
    private final PersonCustomFieldMapper personCustomFieldMapper;
    private final RequestService requestService;

    @Autowired
    public PersonMapper(
            PersonCustomFieldSectionService personCustomFieldSectionService,
            PersonCustomFieldMapper personCustomFieldMapper,
            AttachmentMapper attachmentMapper,
            LookupWorker lookupWorker,
            RequestService requestService) {
        super(attachmentMapper, lookupWorker);
        this.personCustomFieldSectionService = personCustomFieldSectionService;
        this.personCustomFieldMapper = personCustomFieldMapper;
        this.requestService = requestService;
    }

    public Person mapDtoToEntity(PersonDto personDto) {
        Person person = new Person();
        List<PersonCustomFieldValue> personCustomFieldValues = this.getCustomFieldValuesFromDto(personDto, person);
        person.setId(personDto.getId());
        person.setCustomFieldValues(personCustomFieldValues);
        person.setAttachments(new ArrayList<>());
        return person;
    }

    public PersonDetailDto mapEntityToDto(Person person) {
        PersonDetailDto personDetailDto = this.modelMapper.map(person, PersonDetailDto.class);
        List<ProfileCustomFieldSectionDto> sections = this.getSection(person);
        personDetailDto.setCustomFieldSections(sections);
        personDetailDto.setAttachments(
                person.getAttachments()
                        .stream()
                        .map(this.attachmentMapper::mapToDto)
                        .collect(Collectors.toList()));
        return personDetailDto;
    }

    public GetPersonDetailsDto getMapEntityToDto(Person person) {
        GetPersonDetailsDto detailsDto = this.modelMapper.map(person, GetPersonDetailsDto.class);
        List<ProfileCustomFieldSectionDto> sections = this.getSection(person);
        detailsDto.setCustomFieldSections(sections);
        detailsDto.setAttachments(person.getAttachments()
                .stream()
                .map(this.attachmentMapper::mapToDto)
                .collect(Collectors.toList()));
        detailsDto.setIsReadOnly(this.requestService.isActiveRequest(RequestType.PEOPLE_EDIT, person.getId()));
        return detailsDto;
    }

    public Person zip(Person person, PersonDto personDto) {
        Person zippedPerson = new Person();
        this.modelMapper.map(person, zippedPerson);
        List<PersonCustomFieldValue> newValues = this.getCustomFieldValuesFromDto(personDto, zippedPerson);
        zippedPerson.setCustomFieldValues(newValues);
        zippedPerson.setAttachments(person.getAttachments());
        return zippedPerson;
    }

    private List<ProfileCustomFieldSectionDto> getSection(Person person) {
        List<ProfileCustomFieldSectionDto> sections = this.personCustomFieldSectionService.findAll()
                .stream()
                .map(s -> {
                    ProfileCustomFieldSectionDto dto = this.modelMapper.map(s, ProfileCustomFieldSectionDto.class);
                    List<CustomFieldValueDto> valueDtos = s.getCustomFields()
                            .stream()
                            .map(cf -> {
                                CustomFieldDto customFieldDto = this.personCustomFieldMapper.map(cf);
                                CustomFieldValueDto valueDto = new CustomFieldValueDto();

                                Optional<PersonCustomFieldValue> customFieldValue = person.getCustomFieldValues()
                                        .stream()
                                        .filter(cfv -> cf.getId().equals(cfv.getCustomField().getId()))
                                        .findFirst();
                                if (customFieldValue.isPresent()) {
                                    String value = customFieldValue.get().getValue();
                                    valueDto.setValue(value);
                                    if (cf.getFieldType().equals(CustomFieldType.LOOKUP) && !customFieldValue.get().getValue().isEmpty()) {
                                        valueDto.setValue(this.lookupWorker.getLookupValueObject(customFieldDto.getExtra().get("key").toString(), Long.valueOf(value)));
                                    }
                                    valueDto.setStatus(customFieldValue.get().getStatus());
                                } else {
                                    valueDto.setValue("");
                                }
                                valueDto.setCustomField(customFieldDto);
                                return valueDto;
                            })
                            .collect(Collectors.toList());
                    dto.setValues(valueDtos);
                    return dto;
                })
                .collect(Collectors.toList());
        return sections;
    }

    private List<PersonCustomField> getAllCustomFields() {
        return this.personCustomFieldSectionService.findAll()
                .stream()
                .sorted(Comparator.comparingInt(CustomFieldSection::getOrder))
                .flatMap(s -> s.getCustomFields().stream().sorted(Comparator.comparingInt(CustomField::getOrder)))
                .collect(Collectors.toList());
    }

    private List<PersonCustomFieldValue> getCustomFieldValuesFromDto(PersonDto personDto, Person person) {
        return this.getAllCustomFields()
                .stream()
                .map(f -> {
                    String value = personDto.getFieldValues()
                            .stream()
///TODO fieldId can be remove becouse we can use CODE(NAME)
                            .filter(v -> {
                                    if (v.getFieldId()==0) { // Holy shit long and Long. I'm afraid change long->Long before release day's.
                                        return f.getName().equals(v.getCode());
                                    }
                                    return v.getFieldId() == f.getId();
                                }
                            )
                            .findFirst()
                            .map(FieldValueDto::getValue)
                            .orElse("");
                    PersonCustomFieldValue customFieldValue = new PersonCustomFieldValue();
                    customFieldValue.setCustomField(f);
                    customFieldValue.setValue(value);
                    customFieldValue.setOwner(person);
                    return customFieldValue;
                })
                .collect(Collectors.toList());
    }
}
