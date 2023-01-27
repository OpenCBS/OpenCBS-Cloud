package com.opencbs.core.services;

import com.opencbs.core.domain.Relationship;
import com.opencbs.core.repositories.RelationshipRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RelationshipService {

    private final RelationshipRepository relationshipRepository;

    public RelationshipService(RelationshipRepository relationshipRepository) {
        this.relationshipRepository = relationshipRepository;
    }

    public Optional<Relationship> findOne(long id) {
        return Optional.ofNullable(this.relationshipRepository.findOne(id));
    }

    public List<Relationship> findAll() {
        return this.relationshipRepository.findAll();
    }
}
