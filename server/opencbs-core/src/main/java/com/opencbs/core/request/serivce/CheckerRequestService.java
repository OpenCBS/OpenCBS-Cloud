package com.opencbs.core.request.serivce;

import com.opencbs.core.request.domain.CheckerRequest;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.repository.CheckerRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CheckerRequestService {

    private final CheckerRequestRepository checkerRequestRepository;


    public List<CheckerRequest> getAll() {
        return this.checkerRequestRepository.findAll();
    }

    public CheckerRequest findByRequestType(RequestType requestType) {
        return this.checkerRequestRepository.findByRequestType(requestType);
    }
}
