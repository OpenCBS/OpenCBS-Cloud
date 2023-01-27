package com.opencbs.core.request.controller;

import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.dto.BaseRequestDetailsDto;
import com.opencbs.core.request.dto.RequestDetailsDto;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import com.opencbs.core.request.mapper.RequestMapper;
import com.opencbs.core.request.serivce.MakerCheckerWorker;
import com.opencbs.core.request.serivce.RequestService;
import com.opencbs.core.request.validators.RequestValidator;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping(value = "/api/requests")
@RequiredArgsConstructor
public class RequestController {

    private final RequestService requestService;
    private final RequestMapper requestMapper;
    private final RequestValidator requestValidator;
    private final MakerCheckerWorker makerCheckerWorker;


    @GetMapping
    public Page<BaseRequestDetailsDto> getAllByUser(Pageable pageable) {
        Page<Request> allRequests = this.requestService.getRequestsByUser(UserHelper.getCurrentUser(), pageable);
        ModelMapper modelMapper = new ModelMapper();
        return allRequests.map(x -> modelMapper.map(x, BaseRequestDetailsDto.class));
    }

    @GetMapping(value = "/{id}")
    public RequestDetailsDto get(@PathVariable long id) throws IOException {
        return this.requestMapper.mapEntityToDto(this.requestService.findByIdAndBranch(id, UserHelper.getCurrentUser().getBranch()));
    }

    @GetMapping(value = "/{id}/content")
    public BaseRequestDto getContent(@PathVariable long id) throws IOException {
        return this.requestMapper.mapEntityToContent(this.requestService.findByIdAndBranch(id, UserHelper.getCurrentUser().getBranch()));
    }

    @PostMapping(value = "/{id}/approve")
    public Long approveRequest(@PathVariable long id) throws Exception {
        Request request = this.requestService.findByIdAndBranch(id, UserHelper.getCurrentUser().getBranch());
        this.requestValidator.validateOnApprove(request);
        return this.makerCheckerWorker.approve(request);
    }

    @PostMapping(value = "/{id}/delete")
    public String deleteRequest(@PathVariable long id) {
        Request request = this.requestService.findByIdAndBranch(id, UserHelper.getCurrentUser().getBranch());
        this.requestService.delete(request);
        return "Request has been deleted successfully";
    }

}
