package com.opencbs.core.services.customFields;

import com.opencbs.core.domain.customfields.CustomFieldSection;
import com.opencbs.core.repositories.Repository;

import org.springframework.transaction.annotation.Transactional;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class CustomFieldSectionService<Tcfs extends CustomFieldSection, Trepo extends Repository<Tcfs>> {

    private Trepo repository;

    public CustomFieldSectionService(Trepo repository) {
        this.repository = repository;
    }

    public List<Tcfs> findAll() {
        return this.repository.findAll()
                .stream()
                .sorted(Comparator.comparingInt(Tcfs::getOrder))
                .collect(Collectors.toList());
    }

    public Optional<Tcfs> findOne(long id) {
        Tcfs section = this.repository.findOne(id);
        return section == null ? Optional.empty() : Optional.of(section);
    }

    @Transactional
    public Tcfs create(Tcfs section) {
        section.setOrder(this.getNewSectionOrder());
        return this.repository.save(section);
    }

    @Transactional
    public Tcfs update(Tcfs section) {
        return this.repository.save(section);
    }

    @Transactional
    public Tcfs updateWithOrder(Tcfs section, int oldOrder) throws IllegalArgumentException {
        if (section.getOrder() == oldOrder) {
            throw new IllegalArgumentException("Old order is the same as new one.");
        }

        if (section.getOrder() < oldOrder) {
            // Section moved up: shift the rest to bottom.
            this.shiftToBottom(section, oldOrder);
        } else {
            // Section moved down: shift the rest to top.
            this.shiftToTop(section, oldOrder);
        }

        return this.repository.save(section);
    }

    private void shiftToBottom(Tcfs section, int oldOrder) {
        List<Tcfs> affectedSections = this.findAll()
                .stream()
                .filter(s -> s.getOrder() >= section.getOrder() && s.getOrder() < oldOrder && !s.getId().equals(section.getId()))
                .collect(Collectors.toList());
        for (Tcfs s : affectedSections) {
            s.setOrder(s.getOrder() + 1);
            this.repository.save(s);
        }
    }

    private void shiftToTop(Tcfs section, int oldOrder) {
        List<Tcfs> affectedSections = this.findAll()
                .stream()
                .filter(s -> s.getOrder() > oldOrder && s.getOrder() <= section.getOrder() && !s.getId().equals( section.getId()))
                .collect(Collectors.toList());
        for (Tcfs s : affectedSections) {
            s.setOrder(s.getOrder() - 1);
            this.repository.save(s);
        }
    }

    private int getNewSectionOrder() {
        Optional<Tcfs> lastSection = this.findLast();
        return lastSection.isPresent() ? lastSection.get().getOrder() + 1 : 1;
    }

    private Optional<Tcfs> findLast() {
        Comparator<Tcfs> comparator = Comparator.comparing(Tcfs::getOrder);
        return this.findAll().stream().sorted(comparator.reversed()).findFirst();
    }
}
