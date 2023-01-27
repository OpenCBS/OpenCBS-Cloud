package com.opencbs.core.request.serivce;

import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.Permission;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.json.ExtraJson;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.exceptions.ApiException;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.request.domain.*;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import com.opencbs.core.request.interfaces.RequestHandler;
import com.opencbs.core.request.repository.ActionRequestRepository;
import com.opencbs.core.request.repository.RequestRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RequestService {

    private final RequestRepository requestRepository;
    private final ActionRequestRepository actionRequestRepository;
    private final CheckerRequestService checkerRequestService;
    private final ApplicationContext applicationContext;
    private List<RequestHandler> requestHandlers;

    public Request save(Request request) {
        return this.requestRepository.save(request);
    }

    public Page<Request> getRequestsByUser(User user, Pageable pageable) {
        List<CheckerRequest> checkerRequests = this.checkerRequestService.getAll();
        List<Permission> permissions = new ArrayList<>(user.getRole().getPermissions());
        List<RequestType> requestTypes = new ArrayList<>();

        for (CheckerRequest checkerRequest : checkerRequests) {
            Long currentCheckerPermissionId = checkerRequest.getPermissionId();
            for (Permission permission : permissions) {
                Long permissionId = permission.getId();
                if (currentCheckerPermissionId.equals(permissionId)) {
                    requestTypes.add(checkerRequest.getRequestType());
                }
            }
        }

        return this.requestRepository.findAllByTypeInAndDeletedFalseAndBranchOrCreatedByAndDeletedFalse(requestTypes, user.getBranch(), user, pageable);
    }

    public Request findByIdAndBranch(Long id, Branch branch) {
        return this.findOne(id, branch)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Request not found (ID=%d).", id)));
    }

    private Optional<Request> findOne(Long id, Branch branch) {
        return this.requestRepository.findByIdAndBranch(id, branch);
    }

    public void delete(Request request) {
        request.setDeletedBy(UserHelper.getCurrentUser());
        request.setDeletedAt(DateHelper.getLocalDateTimeNow());
        request.setDeleted(true);
        this.requestRepository.save(request);
    }

    public boolean isActiveRequest(RequestType requestType, Long entityId) {
        Optional<Request> request = this.requestRepository.findByTypeAndEntityIdAndDeletedFalse(requestType, entityId);
        if (request.isPresent()) {
            return true;
        }

        return false;
    }

    public boolean isActiveRequestByModuleType(ModuleType moduleType, Long entityId) {
        List<Request> requests = this.requestRepository.findAllByModuleTypeAndEntityIdAndDeletedFalse(moduleType, entityId);
        if (!requests.isEmpty()) {
            return true;
        }

        return false;
    }

    public boolean isActiveRequests() {
        Optional<Request> request = this.requestRepository.findFirstByDeletedFalse();
        if (request.isPresent()) {
            return true;
        }

        return false;
    }

    public List<ActionRequest> getApprovedIdsByUserAndDate(User user, LocalDate fromDate, LocalDate toDate) {
        List<ActionRequest> approvedIdsByUserAndDates = this.actionRequestRepository.getByApprovedIdsByUserAndDates(user,
                LocalDateTime.of(fromDate, LocalTime.MIN), LocalDateTime.of(toDate, LocalTime.MAX));
        approvedIdsByUserAndDates.forEach(actionRequest -> actionRequest.setRequestActionType(RequestActionType.APPROVED));
        return approvedIdsByUserAndDates;
    }

    public List getByIds(List<Long> ids) {
        return requestRepository.findAllByIdIsIn(ids);
    }

    public ExtraJson getContextByRequestType(RequestType requestType, BaseDto dto) throws IOException {
        return this.getRequestHandler(requestType).getContent(dto);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Long approving(Request request) throws Exception {
        RequestHandler requestHandler = this.getRequestHandler(request.getType());
        return requestHandler.approveRequest(request);
    }

    public Class getTargetClassByRequestType(RequestType requestType){
        return this.getRequestHandler(requestType).getTargetClass();
    }

    private RequestHandler getRequestHandler(@NonNull RequestType requestType) {
        for (RequestHandler requestHandler : this.getRequestHandlers()) {
            if (requestType.equals(requestHandler.getRequestType())) {
                return requestHandler;
            }
        }

        throw new ApiException(HttpStatus.NOT_FOUND, "404",
                String.format("Type of application %s not found", requestType));
    }

    public BaseRequestDto getHandleContext(RequestType requestType, Request request) throws IOException {
        return this.getRequestHandler(requestType).handleContent(request);
    }

    public List<RequestHandler> getRequestHandlers() {
        if (requestHandlers==null) {
            requestHandlers = new ArrayList<>();
            requestHandlers.addAll(this.applicationContext.getBeansOfType(RequestHandler.class).values());
        }

        return requestHandlers;
    }
}
