package com.opencbs.core.services;

import com.opencbs.core.accounting.repositories.TillRepository;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.StatusType;
import com.opencbs.core.domain.till.Till;
import com.opencbs.core.repositories.UserRepository;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.services.audit.BaseHistoryService;
import com.opencbs.core.services.audit.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService extends BaseHistoryService<UserRepository> implements CrudService<User>, HistoryService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TillRepository tillRepository;

    @Autowired
    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       TillRepository tillRepository) {
        super(userRepository);
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tillRepository = tillRepository;
    }

    public Optional<User> findByUsername(String username) {
        return this.userRepository.findByUsername(username);
    }

    public Optional<User> findByEmailOrUsername(String search) {
        return this.userRepository.findByEmailOrUsername(search, search);
    }

    public Optional<User> getOne(Long id) {
        return Optional.ofNullable(userRepository.findOne(id));
    }

    @Override
    public User create(User entity) {
        throw new UnsupportedOperationException();
    }

    public List<User> findAll() {
        return this.userRepository.findAllByIsSystemUserFalse();
    }

    public Page<User> findAllByIsSystemUserFalse(Pageable pageable, Long branchId, String search, Boolean showAll) {
        if (search == null ){
            search = "";
        }
        List<StatusType> statusTypes = new ArrayList<>();
        if (!showAll) {
            statusTypes.add(StatusType.ACTIVE);
        }
        if (branchId == null) {
            return this.userRepository.getBySearchPattern(pageable, search.trim(), statusTypes);
        }

        return this.userRepository.getBySearchPatternAndBranchId(pageable, search.trim(), branchId, statusTypes);
    }

    @Transactional
    public User save(User user) {
        user.setPasswordHash(this.passwordEncoder.encode(user.getPasswordHash()));
        return this.userRepository.save(user);
    }

    @Transactional
    public User update(User user) {
        return this.userRepository.save(user);
    }

    public Page<User> findAllTeller(String searchString, Pageable pageable) {
        if (searchString != null){
            return tillRepository.findAllTeller(pageable, searchString);
        }
        List<User> allTellersFromTills = this.tillRepository.findAll()
                .stream()
                .map(Till::getTeller)
                .collect(Collectors.toList());
        List<User> allTellers = this.userRepository
                .findDistinctByIsSystemUserFalseAndRolePermissionsNameIn(pageable, Arrays.asList(User.HEAD_TELLER, User.TELLER)).getContent();
        List<User> freeTellers = allTellers
                .stream()
                .filter(x -> !allTellersFromTills.contains(x))
                .collect(Collectors.toList());
        return new PageImpl<>(freeTellers, pageable, freeTellers.size());
    }

    public Long getCountNotSystemUser(){
        return userRepository.countByIsSystemUserFalse();
    }

    public User getCurrentUser(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (User)auth.getPrincipal();
    }

    public List<User> findActiveUsers() {
        User pattern = new User();
        pattern.setStatusType(StatusType.ACTIVE);
        return this.userRepository.findAll(Example.of(pattern), new Sort(Sort.Direction.ASC, "id"));
    }

    @Override
    public Boolean isRequestSupported(RequestType requestType) {
        return  RequestType.USER_EDIT.equals(requestType) || RequestType.USER_CREATE.equals(requestType);
    }

    public Optional<User> findById(Long entityId) {
        return this.getOne(entityId);
    }

    @Override
    public Class getTargetClass() {
        return User.class;
    }
}
