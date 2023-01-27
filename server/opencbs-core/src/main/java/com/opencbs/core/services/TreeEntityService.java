package com.opencbs.core.services;

import com.opencbs.core.domain.trees.TreeEntity;
import com.opencbs.core.repositories.TreeEntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

public abstract class TreeEntityService<Tr extends TreeEntityRepository, Tte extends TreeEntity> {

    private final Tr repository;

    public TreeEntityService(Tr repository) {
        this.repository = repository;
    }

    public List<Tte> findAll() {
        return this.repository.findAll(new Sort(Sort.Direction.ASC, "id"));
    }

    public Optional<Tte> findOne(long id) {
        return Optional.ofNullable((Tte) this.repository.findOne(id));
    }

    public Optional<Tte> findByName(String name) {
        return this.repository.findByName(name);
    }

    public Optional<Tte> findByNameAndParent(String name, Tte parent) {
        return this.repository.findByNameAndParent(name, parent);
    }

    public Page<Tte> findBy(String query, Pageable pageable) {
        return query == null
                ? this.repository.findLeaves(pageable)
                : this.repository.findBy(query, pageable);
    }

    @Transactional
    public Tte create(Tte entity) {
        return (Tte) this.repository.save(entity);
    }

    @Transactional
    public Tte update(Tte entity) {
        return (Tte) this.repository.save(entity);
    }
}