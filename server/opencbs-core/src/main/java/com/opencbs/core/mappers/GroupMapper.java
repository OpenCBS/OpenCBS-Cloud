package com.opencbs.core.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.domain.customfields.CustomFieldSection;
import com.opencbs.core.domain.customfields.GroupCustomField;
import com.opencbs.core.domain.customfields.GroupCustomFieldValue;
import com.opencbs.core.domain.enums.CustomFieldType;
import com.opencbs.core.domain.profiles.Group;
import com.opencbs.core.domain.profiles.GroupMember;
import com.opencbs.core.domain.profiles.Person;
import com.opencbs.core.dto.FieldValueDto;
import com.opencbs.core.dto.customfields.CustomFieldDto;
import com.opencbs.core.dto.customfields.CustomFieldValueDto;
import com.opencbs.core.dto.group.GroupDetailDto;
import com.opencbs.core.dto.group.GroupDto;
import com.opencbs.core.dto.group.GroupsMembersDto;
import com.opencbs.core.dto.profiles.ProfileCustomFieldSectionDto;
import com.opencbs.core.mappers.customFields.GroupCustomFieldMapper;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.serivce.RequestService;
import com.opencbs.core.services.customFields.GroupCustomFieldSectionService;
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
public class GroupMapper extends ProfileBaseMapper {

    private final GroupCustomFieldSectionService groupCustomFieldSectionService;
    private final GroupCustomFieldMapper groupCustomFieldMapper;
    private final PersonService personService;
    private final RequestService requestService;

    @Autowired
    public GroupMapper(
            AttachmentMapper attachmentMapper,
            GroupCustomFieldSectionService groupCustomFieldSectionService,
            GroupCustomFieldMapper groupCustomFieldMapper,
            LookupWorker lookupWorker,
            PersonService personService,
            RequestService requestService) {
        super(attachmentMapper, lookupWorker);
        this.groupCustomFieldSectionService = groupCustomFieldSectionService;
        this.groupCustomFieldMapper = groupCustomFieldMapper;
        this.personService = personService;
        this.requestService = requestService;
    }

    public Group mapDtoToEntity(GroupDto groupDto) {
        Group group = new Group();

        List<GroupCustomFieldValue> groupCustomFieldValues = this.getCustomFieldValuesFromDto(groupDto, group);
        group.setId(groupDto.getId());
        group.setCustomFieldValues(groupCustomFieldValues);
        return group;
    }

    public GroupDetailDto mapEntityToDto(Group group) {
        ModelMapper customModelMapper = new ModelMapper();
        customModelMapper.addMappings(new PropertyMap<Group, GroupDetailDto>() {
            @Override
            protected void configure() {
                skip().setGroupsMembers(null);
            }
        });
        GroupDetailDto groupDetailDto = customModelMapper.map(group, GroupDetailDto.class);
        groupDetailDto.setGroupsMembers(new ArrayList<>());
        List<ProfileCustomFieldSectionDto> sections = this.groupCustomFieldSectionService
                .findAll()
                .stream()
                .map(s -> {
                    ProfileCustomFieldSectionDto dto = this.modelMapper.map(s, ProfileCustomFieldSectionDto.class);
                    List<CustomFieldValueDto> values = s.getCustomFields()
                            .stream().map(cf -> {
                                CustomFieldDto customFieldDto = this.groupCustomFieldMapper.map(cf);
                                CustomFieldValueDto valueDto = new CustomFieldValueDto();
                                Optional<GroupCustomFieldValue> customFieldValue = group.getCustomFieldValues()
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
        groupDetailDto.setCustomFieldSections(sections);
        groupDetailDto.setIsReadOnly(this.requestService.isActiveRequest(RequestType.GROUP_EDIT, group.getId()));
        if (group.getGroupMembers() != null) {
            List<GroupMember> groupMembers = group.getGroupMembers()
                    .stream()
                    .filter(x -> x.getLeftDate() == null)
                    .collect(Collectors.toList());

            for (GroupMember groupMember : groupMembers) {
                Optional<Person> person = this.personService.findOne(groupMember.getMember().getId());
                GroupsMembersDto groupsMembersDto = new GroupsMembersDto();

                groupsMembersDto.setName(person.get().getName());
                groupsMembersDto.setType(person.get().getType());
                groupsMembersDto.setId(groupMember.getId());
                groupsMembersDto.setGroupId(groupMember.getGroup().getId());
                groupsMembersDto.setMemberId(groupMember.getMember().getId());
                groupsMembersDto.setJoinDate(groupMember.getJoinDate());
                groupsMembersDto.setLeftDate(groupMember.getLeftDate());
                groupDetailDto.getGroupsMembers().add(groupsMembersDto);
            }
        }

        return groupDetailDto;
    }

    public Group zip(Group group, GroupDto groupDto) {
        Group zippedGroup = new Group();
        this.modelMapper.map(group, zippedGroup);
        List<GroupCustomFieldValue> newValues = this.getCustomFieldValuesFromDto(groupDto, zippedGroup);
        zippedGroup.setCustomFieldValues(newValues);
        return zippedGroup;
    }

    private List<GroupCustomField> getAllCustomFields() {
        return this.groupCustomFieldSectionService.findAll()
                .stream()
                .sorted(Comparator.comparingInt(CustomFieldSection::getOrder))
                .flatMap(s -> s.getCustomFields().stream().sorted(Comparator.comparingInt(CustomField::getOrder)))
                .collect(Collectors.toList());
    }

    private List<GroupCustomFieldValue> getCustomFieldValuesFromDto(GroupDto dto, Group group) {
        return this.getAllCustomFields()
                .stream()
                .map(f -> {
                    String value = dto.getFieldValues()
                            .stream()
                            .filter(v -> v.getFieldId() == f.getId())
                            .findFirst()
                            .map(FieldValueDto::getValue)
                            .orElse("");
                    GroupCustomFieldValue customFieldValue = new GroupCustomFieldValue();
                    customFieldValue.setCustomField(f);
                    customFieldValue.setValue(value);
                    customFieldValue.setOwner(group);
                    return customFieldValue;
                })
                .collect(Collectors.toList());
    }
}
