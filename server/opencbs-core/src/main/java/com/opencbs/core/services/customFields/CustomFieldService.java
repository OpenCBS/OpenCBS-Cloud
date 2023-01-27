package com.opencbs.core.services.customFields;

import com.opencbs.core.domain.customfields.CustomField;
import com.opencbs.core.domain.customfields.CustomFieldSection;
import com.opencbs.core.domain.customfields.CustomFieldValue;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.repositories.CustomFieldRepository;
import com.opencbs.core.repositories.CustomFieldValueRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public abstract class CustomFieldService<Tcf extends CustomField, Tcvf extends CustomFieldValue<Tcf>, Trepo extends CustomFieldRepository<Tcf>, TcfvRepo extends CustomFieldValueRepository<Tcvf>> {

    private final Trepo repository;
    private final TcfvRepo valueRepository;

    public CustomFieldService(Trepo repository,
                              TcfvRepo valueRepository) {
        this.repository = repository;
        this.valueRepository = valueRepository;
    }

    public List<Tcf> findAll() {
        return this.repository.findAll()
                .stream()
                .sorted(Comparator.comparingInt(Tcf::getOrder))
                .collect(Collectors.toList());
    }

    public List<Tcf> findBySection(CustomFieldSection section) {
        return this.repository.findBySectionId(section.getId());
    }

    @Transactional
    public Tcf create(Tcf customField) {
        customField.setOrder(this.getNewOrder(customField.getSection()));
        return this.repository.save(customField);
    }

    public Optional<Tcf> findOne(long id) {
        Tcf customField = this.repository.findOne(id);
        return customField == null ? Optional.empty() : Optional.of(customField);
    }

    @Transactional
    public Tcf update(Tcf customField) {
        return this.repository.save(customField);
    }

    @SuppressWarnings("unchecked")
    @Transactional
    public Tcf updateWithSection(Tcf customField, CustomFieldSection newSection) {
        if (customField.getSection().getId().equals(newSection.getId())) {
            throw new IllegalArgumentException("Old section is the same as new one.");
        }

        this.removeItselfFromSection(customField);
        customField.setOrder(this.getNewOrder(newSection));
        customField.setSection(newSection);
        return this.repository.save(customField);
    }

    @Transactional
    public Tcf updateWithOrder(Tcf customField, int oldOrder) throws IllegalArgumentException {
        if (customField.getOrder() == oldOrder) {
            throw new IllegalArgumentException("Old order is the same as new one.");
        }

        if (customField.getOrder() < oldOrder) {
            // CustomField moved up: shift the rest to bottom.
            this.shiftToBottom(customField, oldOrder);
        } else {
            // CustomField moved down: shift the rest to top.
            this.shiftToTop(customField, oldOrder);
        }

        return this.repository.save(customField);
    }

    private void shiftToBottom(Tcf customField, int oldOrder) {
        List<Tcf> affectedFields = this.findBySection(customField.getSection())
                .stream()
                .filter(s -> s.getOrder() >= customField.getOrder() && s.getOrder() < oldOrder && !s.getId().equals(customField.getId()))
                .collect(Collectors.toList());
        for (Tcf s : affectedFields) {
            s.setOrder(s.getOrder() + 1);
            this.repository.save(s);
        }
    }

    private void shiftToTop(Tcf customField, int oldOrder) {
        List<Tcf> affectedCustomFields = this.findBySection(customField.getSection())
                .stream()
                .filter(s -> s.getOrder() > oldOrder && s.getOrder() <= customField.getOrder() && !s.getId().equals( customField.getId()))
                .collect(Collectors.toList());
        for (Tcf s : affectedCustomFields) {
            s.setOrder(s.getOrder() - 1);
            this.repository.save(s);
        }
    }

    private void removeItselfFromSection(CustomField customField) {
        this.findBySection(customField.getSection())
                .stream()
                .filter(cf -> cf.getOrder() > customField.getOrder())
                .forEach(cf -> {
                    cf.setOrder(cf.getOrder() - 1);
                    this.repository.save(cf);
                });
    }

    private int getNewOrder(CustomFieldSection section) {
        Optional<Tcf> last = this.findLast(section);
        return last.isPresent() ? last.get().getOrder() + 1 : 1;
    }

    private Optional<Tcf> findLast(CustomFieldSection section) {
        Comparator<Tcf> comparator = Comparator.comparing(Tcf::getOrder);
        return this.findBySection(section).stream().sorted(comparator.reversed()).findFirst();
    }

    public Optional<Tcvf> findOneByFieldIdAndStatusAndValue(Long id, EntityStatus status, String value) {
        return valueRepository.findOneByCustomFieldIdAndStatusAndValue(id, status, value);
    }

    @Transactional
    public void delete(CustomField customField){
        customField.setDeleted(true);
    }

    public Optional<Tcf> findByName(String code) {
        return this.repository.findByName(code);
    }
}
