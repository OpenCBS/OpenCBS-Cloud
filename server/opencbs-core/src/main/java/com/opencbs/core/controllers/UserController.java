package com.opencbs.core.controllers;

import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.dto.PasswordUpdateDto;
import com.opencbs.core.dto.UserDetailsDto;
import com.opencbs.core.dto.UserDto;
import com.opencbs.core.dto.audit.HistoryDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.mappers.UserMapper;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.dto.RequestDto;
import com.opencbs.core.request.serivce.MakerCheckerWorker;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.core.services.UserService;
import com.opencbs.core.validators.UserDtoValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

@RestController
@RequestMapping(value = "/api/users")
@SuppressWarnings("unused")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final UserDtoValidator userDtoValidator;
    private final MakerCheckerWorker makerCheckerWorker;

    @PermissionRequired(name = "MAKER_FOR_USER", moduleType = ModuleType.MAKER_CHECKER, description = "")
    @PostMapping
    public RequestDto post(@RequestBody UserDto userDto) throws Exception {
        this.userDtoValidator.validateOnCreate(userDto);
        Request request = this.makerCheckerWorker.create(RequestType.USER_CREATE, userDto);
        RequestDto detailsDto = new RequestDto();
        detailsDto.setId(request.getId());
        return detailsDto;
    }

    @PermissionRequired(name = "MAKER_FOR_USER", moduleType = ModuleType.MAKER_CHECKER, description = "")
    @PutMapping(value = "/{id}")
    public RequestDto put(@PathVariable long id, @RequestBody UserDto userDto) throws Exception {
        Optional<User> user = this.userService.findById(id);
        if (!user.isPresent() || user.get().getId() == 1) {
            throw new ResourceNotFoundException(String.format("User not found (ID=%d).", id));
        }
        userDtoValidator.validateOnUpdate(userDto, id);
        Request request = this.makerCheckerWorker.create(RequestType.USER_EDIT, userDto);
        RequestDto detailsDto = new RequestDto();
        detailsDto.setId(request.getId());
        return detailsDto;
    }

    @RequestMapping(path = "current", method = GET)
    public UserDetailsDto getCurrent(Authentication authentication) {
        return this.userMapper.mapToDto((User) authentication.getPrincipal());
    }

    @RequestMapping(path = "/{id}", method = GET)
    public UserDetailsDto get(@PathVariable long id) throws ResourceNotFoundException {
        Optional<User> user = this.userService.findById(id);
        if (!user.isPresent()) {
            throw new ResourceNotFoundException(String.format("User not found (ID=%d).", id));
        }

        return this.userMapper.mapToDto(user.get());
    }

    @RequestMapping(method = GET)
    public List<UserDetailsDto> get(@RequestParam(name = "show_all", defaultValue = "false") Boolean showAll) {
        List<User>  users;
        if (showAll) {
            users = this.userService.findAll();
        } else {
            users = this.userService.findActiveUsers();
        }

        return users
                .stream()
                .map(this.userMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @RequestMapping(value = "/lookup", method = GET)
    public Page<UserDetailsDto> getLookup(@RequestParam(value = "branchId", required = false) Long branchId,
                                          @RequestParam(value = "search", required = false) String search,
                                          @RequestParam(value = "show_all", defaultValue = "false") Boolean showAll,
                                          Pageable pageable) {
        return this.userService.findAllByIsSystemUserFalse(pageable, branchId, search, showAll)
                .map(this.userMapper::mapToDto);
    }

    @RequestMapping(value = "/tellers", method = GET)
    public Page<UserDetailsDto> getAllTellers(@RequestParam(value = "search", required = false) String searchString,
                                              Pageable pageable) {
        return this.userService.findAllTeller(searchString, pageable).map(this.userMapper::mapToDto);
    }

    @RequestMapping(value = "/update-password", method = PUT)
    public UserDetailsDto updatePassword(@RequestBody PasswordUpdateDto dto) throws ResourceNotFoundException {
        User user = this.userService.findById(dto.getUserId()).orElseThrow(
                () -> new ResourceNotFoundException(String.format("User is not found (ID=%d).", dto.getUserId())));
        this.userDtoValidator.validateOnUpdatePassword(user, UserHelper.getCurrentUser(), dto);
        return this.userMapper.mapToDto(this.userService.save(this.userMapper.mapUpdatePassword(user, dto)));
    }

    @GetMapping(value = "/{id}/history")
    public List<HistoryDto> getHistory(@PathVariable Long id) throws Exception {
        this.userService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found(ID=%d).", id)));

        return this.userService.getAllRevisions(id);
    }

    @GetMapping(value = "/{id}/history/last_change")
    public HistoryDto getLastChange(@PathVariable Long id, @RequestParam(value = "dateTime")  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTime) throws Exception {
        this.userService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found(ID=%d).", id)));
        return this.userService.getRevisionByDate(id, dateTime);
    }

    @GetMapping(value = "/find-by-username")
    public Boolean isUserExist(@RequestParam(value = "username") String username){
        return this.userService.findByUsername(username).isPresent();
    }
}
