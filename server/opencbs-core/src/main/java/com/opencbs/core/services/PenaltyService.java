package com.opencbs.core.services;

import com.opencbs.core.domain.Penalty;
import com.opencbs.core.repositories.PenaltyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@RequiredArgsConstructor
@Service
public class PenaltyService {

    private final PenaltyRepository penaltyRepository;


    public Optional<Penalty> get(Long id) {
        return Optional.ofNullable(this.penaltyRepository.findOne(id));
    }

    public Penalty create(Penalty penalty) {
        return this.penaltyRepository.save(penalty);
    }

    public Penalty update(Penalty penalty) {
        return this.penaltyRepository.save(penalty);
    }

    public Page<Penalty> findAll(Pageable pageable) {
        return this.penaltyRepository.findAll(pageable);
    }

    public List<Penalty> findAllByIds(Iterable<Long> ids) {
        return this.penaltyRepository.findAll(ids);
    }
}
