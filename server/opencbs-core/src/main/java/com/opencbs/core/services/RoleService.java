package com.opencbs.core.services;

import com.opencbs.core.domain.Role;
import com.opencbs.core.domain.enums.StatusType;
import com.opencbs.core.repositories.RoleRepository;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.services.audit.BaseHistoryService;
import com.opencbs.core.services.audit.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
public class RoleService extends BaseHistoryService<RoleRepository> implements CrudService<Role>, HistoryService {

    private RoleRepository roleRepository;


    @Autowired
    public RoleService(RoleRepository roleRepository) {
        super(roleRepository);
        this.roleRepository = roleRepository;
    }

    @Transactional
    public Role create(Role role) {
        return this.roleRepository.save(role);
    }

    public List<Role> findAll() {
        Role pattern = new Role();
        pattern.setIsSystem(false);
        pattern.setStatusType(null);

        return this.roleRepository.findAll(Example.of(pattern), new Sort(Sort.Direction.ASC, "id"));
    }

    public Optional<Role> getOne(Long id) {
        return Optional.ofNullable(this.roleRepository.findOne(id));
    }

    @Transactional
    public Role update(Role role) {
        return this.roleRepository.save(role);
    }

    public List<Role> findActiveRoles() {
        Role pattern = new Role();
        pattern.setStatusType(StatusType.ACTIVE);
        pattern.setIsSystem(false);
        ExampleMatcher matcher =
                ExampleMatcher.matching()
                        .withMatcher("status", ExampleMatcher.GenericPropertyMatchers.exact());
        Example<Role> searchExample = Example.of(pattern, matcher);
        return this.roleRepository.findAll(searchExample, new Sort(Sort.Direction.ASC, "id"));
    }

    @Override
    public Boolean isRequestSupported(RequestType requestType) {
        return RequestType.ROLE_EDIT.equals(requestType) || RequestType.ROLE_CREATE.equals(requestType) ;
    }

    @Override
    public Class getTargetClass() {
        return Role.class;
    }
}
