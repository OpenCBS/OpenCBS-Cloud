package com.opencbs.loans.controllers.loanapplications;

import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.domain.Relationship;
import com.opencbs.core.services.RelationshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/api/relationships")
@SuppressWarnings("unused")
public class RelationshipController extends BaseController {

    private final RelationshipService relationshipService;

    @Autowired
    public RelationshipController(RelationshipService relationshipService) {
        this.relationshipService = relationshipService;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<Relationship> get() {
        return this.relationshipService.findAll();
    }
}
