package com.opencbs.core.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.Role;
import com.opencbs.core.domain.SystemSettings;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.SystemSettingsName;
import com.opencbs.core.domain.enums.UserFieldType;
import com.opencbs.core.dto.PasswordUpdateDto;
import com.opencbs.core.dto.UserDto;
import com.opencbs.core.repositories.RoleRepository;
import com.opencbs.core.repositories.UserRepository;
import com.opencbs.core.services.BranchService;
import com.opencbs.core.services.SystemSettingsService;
import io.jsonwebtoken.lang.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;

import java.util.Optional;
import java.util.regex.Pattern;

@Validator
public class UserDtoValidator {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BranchService branchService;
    private final SystemSettingsService systemSettingsService;

    private final String REGEX_PHONE_PATTERN = "\\+?[0-9()-?]+$";
    private final String REGEX_EMAIL_PATTERN = "(?i)^[a-z0-9._%+-]+@[a-z0-9._-]+\\.[a-z]{2,6}$";

    @Autowired
    public UserDtoValidator(UserRepository userRepository,
                            RoleRepository roleRepository,
                            BranchService branchService,
                            SystemSettingsService systemSettingsService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.branchService = branchService;
        this.systemSettingsService = systemSettingsService;
    }

    public void validateOnCreate(UserDto userDto) {
        this.validateWithRegex(userDto.getUsername(), "[A-Za-z0-9]+", 50, UserFieldType.USER_NAME);
        Assert.isTrue(!this.userRepository.findByUsername(userDto.getUsername()).isPresent(), "This username is taken.");
        this.validateFields(userDto.getFirstName(), 250, UserFieldType.FIRST_NAME);
        this.validateFields(userDto.getLastName(), 250, UserFieldType.LAST_NAME);
        this.validatePasswordCreate(userDto.getPassword());
        this.validateRole(userDto);
        Assert.isTrue(this.branchService.findOne(Long.valueOf(userDto.getBranchId())).isPresent(), "There is no branch with this ID");
        this.validateWithRegex(userDto.getEmail(), REGEX_EMAIL_PATTERN, 250, UserFieldType.EMAIL);
        this.validateWithRegex(userDto.getPhoneNumber(), REGEX_PHONE_PATTERN, 250, UserFieldType.PHONE_NUMBER);
    }

    private void validateRole(UserDto userDto) {
        Assert.isTrue(userDto.getRoleId() != 0, "Role is required.");
        Role role = this.roleRepository.getOne(userDto.getRoleId());
        Assert.notNull(role, "Role is not exist.");
        Assert.isTrue(!role.getIsSystem(), "Role can't be system." );
        Assert.notNull(userDto.getBranchId(), "Branch is required.");
    }

    public void validateOnUpdate(UserDto userDto, Long id) {
        this.validateFields(userDto.getFirstName(), 250, UserFieldType.FIRST_NAME);
        this.validateFields(userDto.getLastName(), 250, UserFieldType.LAST_NAME);
        this.validateRole(userDto);
        this.validateWithRegex(userDto.getEmail(), REGEX_EMAIL_PATTERN, 250, UserFieldType.EMAIL);
        this.validateWithRegex(userDto.getPhoneNumber(), REGEX_PHONE_PATTERN, 250, UserFieldType.PHONE_NUMBER);
    }

    public void validateOnUpdatePassword(User user, User currentUser, PasswordUpdateDto dto) {
        Assert.isTrue(currentUser.getId().equals(user.getId()), "You can change only your password.");
        this.validatePasswordCreate(dto.getPassword());
    }

    private void validateFields(String word, Integer length, UserFieldType userFieldType){
        Assert.isTrue(!StringUtils.isEmpty(word.trim()), String.format("%s is required", userFieldType.getType()));
        if (length != null) {
            Assert.isTrue(word.trim().length() <= length, String.format("%s has to contain max %d character", userFieldType.getType(), length));
        }
    }

    private void validateWithRegex(String word, String pattern, int length, UserFieldType userFieldType){
        this.validateFields(word, length, userFieldType);
        Assert.isTrue(word.trim().matches(pattern), String.format("%s is not correct", userFieldType.getType()));
    }

    public void validatePasswordCreate(String password) {
        Optional<SystemSettings> passLength = this.systemSettingsService.findByName(SystemSettingsName.PASSWORD_LENGTH);
        if (passLength.isPresent()) {
            int passwordLength = Integer.parseInt(passLength.get().getValue());
            if (password.length() < passwordLength) {
                throw new RuntimeException(String.format("Password length must be greater than %d", passwordLength));
            }
        }

        Optional<SystemSettings> upperCase = this.systemSettingsService.findByName(SystemSettingsName.UPPER_CASE);
        if (upperCase.isPresent()) {
            boolean isUpperCase = Boolean.parseBoolean(upperCase.get().getValue());
            String regex = ".*[A-Z].*";
            if (isUpperCase) {
                if (!Pattern.compile(regex).matcher(password).matches()) {
                    throw  new RuntimeException("Password must contain at least one upper case letter");
                }
            }
        }

        Optional<SystemSettings> number = this.systemSettingsService.findByName(SystemSettingsName.NUMBERS);
        if (number.isPresent()) {
            boolean isNumber = Boolean.parseBoolean(number.get().getValue());
            String regex = ".*\\d.*";
            if (isNumber) {
                if (!Pattern.compile(regex).matcher(password).matches()) {
                    throw  new RuntimeException("Password must contain at least one digit");
                }
            }
        }
    }

    public void validateEmail(User user) {
        Assert.isTrue(user.getEmail() != null,  "This user has no email.");
    }
}
