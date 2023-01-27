package com.opencbs.core.audit.reports;

import com.opencbs.core.audit.AuditReport;
import com.opencbs.core.audit.AuditReportType;
import com.opencbs.core.audit.dto.AuditBusinessObjectRecordDto;
import com.opencbs.core.audit.dto.AuditReportDto;
import com.opencbs.core.domain.NamedEntity;
import com.opencbs.core.domain.User;
import com.opencbs.core.request.domain.ActionRequest;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestActionType;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.serivce.RequestService;
import com.opencbs.core.services.CrudService;
import com.opencbs.core.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class AuditBusinessObjectsReport implements AuditReport {

    private final static List<RequestType> listOfEventRequests = Arrays.stream(RequestType.values())
            .filter(requestType -> requestType.getEvent()).collect(Collectors.toList());

    private final RequestService requestService;
    private final UserService userService;
    private final List<CrudService> crudServices;


    @Override
    public AuditReportType getType() {
        return AuditReportType.BUSINESS_OBJECT;
    }

    @Override
    public Page getRecords(AuditReportDto filter, Pageable pageable) throws Throwable {
        User user = this.userService.findByUsername(filter.getUsername()).orElse(null);
        List<ActionRequest> actionRequests = requestService.getApprovedIdsByUserAndDate(user, filter.getFromDate(), filter.getToDate());
        actionRequests = actionRequests.stream().filter(actionRequest -> !listOfEventRequests.contains(actionRequest.getRequestType())).collect(Collectors.toList());
        List<ActionRequest> pageActionRequest = actionRequests.stream()
                .sorted(Comparator.comparing(ActionRequest::getActionAt).reversed())
                .skip(pageable.getOffset())
                .limit(pageable.getPageSize())
                .collect(Collectors.toList());

        List<Request> requests = this.requestService.getByIds(
                pageActionRequest.stream()
                        .mapToLong(ActionRequest::getId)
                        .distinct()
                        .boxed()
                        .collect(Collectors.toList())
        );

        List records = new ArrayList();
        for (ActionRequest actionRequest: pageActionRequest){
            AuditBusinessObjectRecordDto recordDto = AuditBusinessObjectRecordDto.builder().build();

            Request request = requests.stream().filter(r -> actionRequest.getId().equals(r.getId())).findFirst().get();
            Optional<NamedEntity> optionalNamedEntity = this.getEntityByRequestType(request.getType(), request.getEntityId());

            if (!optionalNamedEntity.isPresent()) {
                continue;
            }

            recordDto.setObjectId(request.getEntityId());
            recordDto.setRequestType(request.getType());
            recordDto.setAction(actionRequest.getRequestActionType());
            recordDto.setDescription(optionalNamedEntity.get().getName());

            if (RequestActionType.REQUEST.equals(actionRequest.getRequestActionType())) {
                recordDto.setUsername(request.getCreatedBy().getFullName());
                recordDto.setDateTime(request.getCreatedAt());
            }

            if (RequestActionType.APPROVED.equals(actionRequest.getRequestActionType())) {
                recordDto.setUsername(request.getApprovedBy().getFullName());
                recordDto.setDateTime(request.getApprovedAt());
                recordDto.setObjectId(request.getEntityId());
            }

            if (RequestActionType.REJECTED.equals(actionRequest.getRequestActionType())) {
                recordDto.setUsername(request.getDeletedBy().getFullName());
                recordDto.setDateTime(request.getDeletedAt());
            }
            records.add(recordDto);
        }

        return new PageImpl(records, pageable, actionRequests.size());
    }

    private Optional<NamedEntity> getEntityByRequestType(RequestType requestType, Long entityId) throws Throwable {
        return  getCrudServiceByRequestType(requestType).getOne(entityId);
                //.orElseThrow(()-> new ResourceNotFoundException(String.format("Not found Entity by Request Type:%s and Entity Id:%s", requestType, entityId)));
        //return namedBaseEntity;
    }

    private CrudService getCrudServiceByRequestType(RequestType requestType){
        for (CrudService crudService: crudServices){
            if (crudService.isRequestSupported(requestType)){
                return crudService;
            }
        }
        throw new UnsupportedOperationException(String.format("Not found crud service for Request Type:%s", requestType));
    }
}
