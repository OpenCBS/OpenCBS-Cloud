package com.opencbs.core.controllers.profiles;

import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.profiles.Group;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.dto.group.GroupDetailDto;
import com.opencbs.core.dto.group.GroupDto;
import com.opencbs.core.dto.profiles.ProfileDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.mappers.GroupMapper;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.dto.RequestDto;
import com.opencbs.core.request.serivce.MakerCheckerWorker;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.core.services.GroupService;
import com.opencbs.core.validators.GroupDtoValidator;
import com.opencbs.core.validators.GroupValidator;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/profiles/groups")
@SuppressWarnings("unused")
@RequiredArgsConstructor
public class GroupController extends BaseController {

    private final GroupService groupService;
    private final GroupDtoValidator validator;
    private final GroupMapper groupMapper;
    private final GroupValidator groupValidator;
    private final MakerCheckerWorker makerCheckerWorker;


    @GetMapping(value = "/{id}")
    public GroupDetailDto get(@PathVariable long id) {
        return this.groupService.findOne(id, UserHelper.getCurrentUser())
                .map(this.groupMapper::mapEntityToDto)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Group not found (ID=%d).", id)));
    }

    @GetMapping(value = "/lookup")
    public Page<GroupDetailDto> get(@RequestParam(value = "search", required = false) String query, Pageable pageable) {
        return this.groupService.search(query, pageable).map(this.groupMapper::mapEntityToDto);
    }

    @PermissionRequired(name = "MAKER_FOR_GROUP", moduleType = ModuleType.MAKER_CHECKER, description = "")
    @PostMapping()
    public RequestDto post(@RequestBody GroupDto groupDto) throws Exception {
        this.validator.validate(groupDto);
        Request request = this.makerCheckerWorker.create(RequestType.GROUP_CREATE, groupDto);
        RequestDto detailsDto = new RequestDto();
        detailsDto.setId(request.getId());
        return  detailsDto;
    }

    @PermissionRequired(name = "MAKER_FOR_GROUP", moduleType = ModuleType.MAKER_CHECKER, description = "")
    @PutMapping(value = "/{id}")
    public RequestDto put(@PathVariable long id,
                              @RequestBody GroupDto groupDto) throws Exception {
        groupDto.setId(id);
        this.validator.validate(groupDto);
        Request request = this.makerCheckerWorker.create(RequestType.GROUP_EDIT, groupDto);
        RequestDto detailsDto = new RequestDto();
        detailsDto.setId(request.getId());
        return detailsDto;
    }

    @PostMapping(value = "/{id}/members/add/{memberId}")
    public GroupDetailDto addMember(@PathVariable long id,
                                    @PathVariable(name = "memberId") long memberId) throws ResourceNotFoundException {
        Group group = this.groupService.getGroup(id);
        this.groupValidator.validateMembers(memberId, id);
        return this.groupMapper.mapEntityToDto(this.groupService.addMember(group, memberId));
    }

    @PostMapping(value = "/{id}/members/remove/{memberId}")
    public GroupDetailDto removeMember(@PathVariable long id,
                                       @PathVariable(name = "memberId") long memberId) throws ResourceNotFoundException {
        Group group = this.groupService.getGroup(id);
        this.groupValidator.validateMemberForLeaveGroup(memberId, group);
        return this.groupMapper.mapEntityToDto(this.groupService.removeMember(group, memberId));
    }

    @RequestMapping(value = "{groupId}/members/lookup", method = RequestMethod.GET)
    public Page<ProfileDto> getAllPeopleWithoutDuplicate(@PathVariable(name = "groupId") long groupId,
                                                         @RequestParam(value = "search", required = false) String search, Pageable pageable) {
        Group group = this.groupService.getGroup(groupId);
        Page<Profile> allPeopleWithoutDuplicate = this.groupService.getAllPeopleWithoutDuplicate(group, search, pageable);
        ModelMapper mapper = new ModelMapper();
        return allPeopleWithoutDuplicate.map(x -> mapper.map(x, ProfileDto.class));
    }
}
