package com.opencbs.core.controllers;

import com.opencbs.core.domain.Role;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.dto.RoleDetailsDto;
import com.opencbs.core.dto.RoleDetailsForSaveDto;
import com.opencbs.core.dto.audit.HistoryDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.RoleMapper;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.dto.RequestDto;
import com.opencbs.core.request.serivce.MakerCheckerWorker;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.core.services.RoleService;
import com.opencbs.core.validators.RoleValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/roles")
@SuppressWarnings("unused")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;
    private final RoleValidator validator;
    private final RoleMapper roleMapper;
    private final MakerCheckerWorker makerCheckerWorker;


    @PermissionRequired(name = "MAKER_FOR_ROLE", moduleType = ModuleType.MAKER_CHECKER, description = "")
    @RequestMapping(method = RequestMethod.POST)
    public RequestDto post(@RequestBody RoleDetailsForSaveDto roleDto) throws Exception {
        this.validator.validateOnCreate(roleDto);
        Request request = this.makerCheckerWorker.create(RequestType.ROLE_CREATE, roleDto);
        RequestDto detailsDto = new RequestDto();
        detailsDto.setId(request.getId());
        return detailsDto;
    }

    @PermissionRequired(name = "MAKER_FOR_ROLE", moduleType = ModuleType.MAKER_CHECKER, description = "")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public RequestDto put(@PathVariable long id,
                          @RequestBody RoleDetailsForSaveDto roleDto) throws Exception {
        roleDto.setId(id);
        this.validator.validateOnUpdate(roleDto, id);
        Request request = this.makerCheckerWorker.create(RequestType.ROLE_EDIT, roleDto);
        RequestDto detailsDto = new RequestDto();
        detailsDto.setId(request.getId());
        return detailsDto;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<Role> get(@RequestParam(name = "show_all", defaultValue = "false") Boolean showAll) {
        if (showAll) {
            return this.roleService.findAll();
        }
        return this.roleService.findActiveRoles();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public RoleDetailsDto get(@PathVariable Long id) throws ResourceNotFoundException {
        Optional<Role> role = this.roleService.getOne(id);
        if (!role.isPresent()) {
            throw new ResourceNotFoundException(String.format("Role not found (ID=%d).", id));
        }

        return this.roleMapper.mapToDetailsDtoForRole(role.get());
    }

    @GetMapping(value = "/{id}/history")
    public List<HistoryDto> getHistory(@PathVariable Long id) throws Exception {
        this.roleService.getOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Role not found(ID=%d).", id)));

        return this.roleService.getAllRevisions(id);
    }

    @GetMapping(value = "/{id}/history/last_change")
    public HistoryDto getLastChange(@PathVariable Long id, @RequestParam(value = "dateTime")  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTime) throws Exception {
        this.roleService.getOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Role not found(ID=%d).", id)));
        return this.roleService.getRevisionByDate(id, dateTime);
    }
}
