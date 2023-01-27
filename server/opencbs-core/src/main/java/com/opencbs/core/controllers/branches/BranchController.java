package com.opencbs.core.controllers.branches;

import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.dto.BranchDto;
import com.opencbs.core.dto.BranchUpdateDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.BranchMapper;
import com.opencbs.core.services.BranchService;
import com.opencbs.core.validators.BranchDtoValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@RestController
@RequestMapping(value = "/api/branches")
public class BranchController extends BaseController {

    private final BranchService branchService;
    private final BranchDtoValidator branchDtoValidator;
    private final BranchMapper branchMapper;

    @Autowired
    public BranchController(BranchService branchService,
                            BranchDtoValidator branchDtoValidator,
                            BranchMapper branchMapper) {
        this.branchService = branchService;
        this.branchDtoValidator = branchDtoValidator;
        this.branchMapper = branchMapper;
    }

    @RequestMapping(method = RequestMethod.GET)
    public Page<BranchDto> get(Pageable pageable) {
        return this.branchService.findAll(pageable)
                .map(this.branchMapper::mapToDto);
    }

    @RequestMapping(value = "/lookup", method = GET)
    public Page<BranchDto> getLookup(@RequestParam(value = "search", required = false) String search, Pageable pageable) {
        return this.branchService.findByNameContaining(pageable, search)
                .map(this.branchMapper::mapToDto);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public BranchDto get(@PathVariable Long id) throws ResourceNotFoundException {
        Branch branch = this.branchService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Branch not found (ID=%d).", id)));
        return this.branchMapper.mapToDto(branch);
    }

    @RequestMapping(method = RequestMethod.POST)
    public BranchDto create(@RequestBody BranchUpdateDto branchDto) throws ResourceNotFoundException {
        this.branchDtoValidator.validateOnCreate(branchDto);
        Branch branch = branchMapper.mapToEntity(branchDto);
        return this.branchMapper.mapToDto(this.branchService.create(branch));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public BranchDto edit(@PathVariable Long id, @RequestBody BranchUpdateDto branchDto) throws ResourceNotFoundException {
        this.branchService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Branch not found(ID=%d).", id)));
        this.branchDtoValidator.validateOnUpdate(branchDto, id);
        Branch branch = branchMapper.mapToEntity(branchDto);
        branch.setId(id);
        return this.branchMapper.mapToDto(this.branchService.update(branch));
    }
}