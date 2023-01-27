package com.opencbs.core.request.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.PermissionRole;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.repositories.PermissionRoleRepository;
import com.opencbs.core.request.domain.CheckerRequest;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.repository.CheckerRequestRepository;

import java.util.List;

@Validator
public class RequestValidator {

    private final CheckerRequestRepository checkerRequestRepository;
    private final PermissionRoleRepository permissionRoleRepository;

    public RequestValidator(CheckerRequestRepository checkerRequestRepository,
                            PermissionRoleRepository permissionRoleRepository) {
        this.checkerRequestRepository = checkerRequestRepository;
        this.permissionRoleRepository = permissionRoleRepository;
    }

    public void validateOnApprove(Request request) {
        CheckerRequest checkerRequest = this.checkerRequestRepository.findByRequestType(request.getType());
        List<PermissionRole> permissionRoles = this.permissionRoleRepository.findByRoleId(UserHelper.getCurrentUser().getRole().getId());
        for (PermissionRole permissionRole : permissionRoles) {
            if (permissionRole.getPermissionId().equals(checkerRequest.getPermissionId())) {
                return;
            }
        }
        throw new RuntimeException("You don't have a permission to approve the request");
    }

}
