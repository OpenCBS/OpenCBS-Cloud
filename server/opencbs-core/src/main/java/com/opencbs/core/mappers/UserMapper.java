package com.opencbs.core.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.Role;
import com.opencbs.core.domain.SystemSettings;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.PasswordExpirePeriod;
import com.opencbs.core.domain.enums.SystemSettingsName;
import com.opencbs.core.dto.PasswordUpdateDto;
import com.opencbs.core.dto.UserBaseDto;
import com.opencbs.core.dto.UserDetailsDto;
import com.opencbs.core.dto.UserDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.serivce.RequestService;
import com.opencbs.core.services.BranchService;
import com.opencbs.core.services.RoleService;
import com.opencbs.core.services.SystemSettingsService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.modelmapper.ModelMapper;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.util.Optional;

@RequiredArgsConstructor
@Mapper
public class UserMapper {

    private final RoleService roleService;
    private final RoleMapper roleMapper;
    private final BranchService branchService;
    private final SystemSettingsService systemSettingsService;
    private final RequestService requestService;


    public User map(UserDto userDto) {
        this.trimAllStringFields(userDto);
        User user = new ModelMapper().map(userDto, User.class);
        Role role = new Role();
        role.setId(userDto.getRoleId());
        user.setRole(role);
        user.setPasswordHash(userDto.getPassword());
        Branch branch = this.branchService.findOne(Long.valueOf(userDto.getBranchId()))
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Branch not found (ID=%d).", userDto.getBranchId())));
        user.setBranch(branch);
        user.setExpireDate(this.calculateExpireDate());
        return user;
    }

    public User zip(User user, UserDto userDto) {
        user.setEmail(userDto.getEmail().trim());
        user.setPhoneNumber(userDto.getPhoneNumber().trim());
        user.setFirstName(userDto.getFirstName().trim());
        user.setLastName(userDto.getLastName().trim());
        user.setRole(roleService.getOne(userDto.getRoleId()).get());
        Branch branch = this.branchService.findOne(Long.valueOf(userDto.getBranchId()))
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Branch not found (ID=%d).", userDto.getBranchId())));
        user.setBranch(branch);
        user.setIdNumber(userDto.getIdNumber().trim());
        user.setAddress(userDto.getAddress().trim());
        user.setPosition(userDto.getPosition().trim());
        user.setStatusType(userDto.getStatusType());
        return user;
    }

    public User mapUpdatePassword(User user, PasswordUpdateDto dto) {
        user.setPasswordHash(dto.getPassword());
        user.setExpireDate(this.calculateExpireDate());
        user.setFirstLogin(false);
        return user;
    }

    public UserDetailsDto mapToDto(User user) {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setAmbiguityIgnored(true);
        Role role = this.roleService.getOne(user.getRole().getId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Role not found (ID=%d).", user.getRole().getId())));
        user.setRole(role);
        UserDetailsDto dto = modelMapper.map(user, UserDetailsDto.class);
        dto.setRole(this.roleMapper.mapToDetailsDto(user.getRole()));
        dto.setIsAdmin(user.getId() == 2);
        dto.setReadOnly(this.requestService.isActiveRequest(RequestType.USER_EDIT, user.getId()));
        return dto;
    }

    @SneakyThrows
    private void trimAllStringFields(UserDto userDto){
        final Field[] declaredFields = userDto.getClass().getDeclaredFields();
        for (Field field: declaredFields) {
            if (field.getType().isAssignableFrom(String.class)) {
                field.setAccessible(true);
                field.set(userDto, field.get(userDto).toString().trim());
            }
        }
    }

    private LocalDate calculateExpireDate() {
        LocalDate date = null;
        Optional<SystemSettings> expireDate = this.systemSettingsService.findByName(SystemSettingsName.EXPIRE_PERIOD);
        if (expireDate.isPresent()) {
            String expire = expireDate.get().getValue();

            if (PasswordExpirePeriod.WEEK.toString().equals(expire)) {
                date = DateHelper.getLocalDateNow().plusWeeks(1);
            }

            if (PasswordExpirePeriod.TWO_WEEKS.toString().equals(expire)) {
                date = DateHelper.getLocalDateNow().plusWeeks(2);
            }

            if (PasswordExpirePeriod.MONTH.toString().equals(expire)) {
                date = DateHelper.getLocalDateNow().plusMonths(1);
            }

            if (PasswordExpirePeriod.NEVER.toString().equals(expire)) {
                date = DateHelper.getLocalDateNow().plusYears(1000);
            }
        }

        return date;
    }

    public UserBaseDto mapToBaseDto(@NonNull User user) {
        return new ModelMapper().map(user, UserBaseDto.class);
    }
}
