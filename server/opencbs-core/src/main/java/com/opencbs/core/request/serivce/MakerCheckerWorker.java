package com.opencbs.core.request.serivce;

import com.opencbs.core.domain.PermissionRole;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.json.ExtraJson;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.request.domain.CheckerRequest;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.services.PermissionService;
import com.opencbs.core.services.audit.HistoryService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MakerCheckerWorker {

    private final RequestService requestService;
    private final CheckerRequestService checkerRequestService;
    private final PermissionService permissionService;
    private final List<HistoryService> historyServices;


    @Transactional
    public Request create(RequestType requestType, @NonNull BaseDto dto) throws Exception {
        if (dto.getId()>0 && (this.requestService.isActiveRequest(requestType, dto.getId())
                || this.requestService.isActiveRequestByModuleType(requestType.getType(), dto.getId()))) {
            throw new RuntimeException("This object has already active request!");
        }

        ExtraJson content = this.requestService.getContextByRequestType(requestType, dto);
        User currentUser = UserHelper.getCurrentUser();
        Request request = new Request();
        request.setType(requestType);
        request.setCreatedBy(currentUser);
        request.setCreatedAt(DateHelper.getLocalDateTimeNow());
        request.setExpireDate(DateHelper.getLocalDateNow().plusMonths(1));
        request.setContent(content);
        request.setDeleted(false);
        request.setBranch(UserHelper.getCurrentUser().getBranch());
        request.setModuleType(requestType.getType());
        if (dto.getId()>0) {
            request.setEntityId(dto.getId());
        }
        request = this.requestService.save(request);
        if (isApproveRequest(requestType, currentUser)) {
            this.approve(request);
        }
        return request;
    }

    @Transactional
    public Long approve(Request request) throws Exception {
        Optional<HistoryService> historyService = this.getHistoryServiceByEntity(this.requestService.getTargetClassByRequestType(request.getType()));

        Long entityId = this.requestService.approving(request);

        LocalDateTime approvedDateTime = DateHelper.getLocalDateTimeNow();

        if (historyService.isPresent()) {
             approvedDateTime = historyService.get().getDateTimeLastRevision(entityId);
        }

        request.setDeletedAt(approvedDateTime);
        request.setApprovedAt(approvedDateTime);
        request.setApprovedBy(UserHelper.getCurrentUser());
        request.setDeleted(true);
        request.setEntityId(entityId);
        this.requestService.save(request);

        return entityId;
    }

    private Boolean isApproveRequest(RequestType requestType, User user) {
        CheckerRequest checkerRequest = this.checkerRequestService.findByRequestType(requestType);
        List<PermissionRole> permissionRoles = this.permissionService.findByRole(user.getRole());
        for (PermissionRole permissionRole : permissionRoles) {
            if (permissionRole.getPermissionId().equals(checkerRequest.getPermissionId())) {
                return true;
            }
        }
        return false;
    }

    private Optional<HistoryService> getHistoryServiceByEntity(Class entityClass){
        if (entityClass == null ){
            return Optional.empty();
        }
        
        for (HistoryService historyService : this.historyServices) {
            if (historyService.getTargetClass().isAssignableFrom(entityClass)) {
                return Optional.of(historyService);
            }
        }
        throw new UnsupportedOperationException(String.format("Not found History Service for Entity Type:%s", entityClass));
    }
}
