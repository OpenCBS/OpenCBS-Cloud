package com.opencbs.core.accounting.services;

import com.opencbs.core.domain.till.Vault;
import com.opencbs.core.accounting.repositories.VaultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class VaultService {
    private final VaultRepository vaultRepository;

    @Autowired
    public VaultService(VaultRepository vaultRepository) {
        this.vaultRepository = vaultRepository;
    }

    public Page<Vault> findAll(Pageable pageable) {
        return this.vaultRepository.findAll(pageable);
    }

    public Optional<Vault> findById(long id) {
        return Optional.ofNullable(this.vaultRepository.findOne(id));
    }

    @Transactional
    public Vault create(Vault vault) {
        vault.setId(null);
        return this.vaultRepository.save(vault);
    }

    public Optional<Vault> findByName(String name) {
        return Optional.ofNullable(this.vaultRepository.findByName(name));
    }

    @Transactional
    public Vault update(Vault vault) {
        return this.vaultRepository.save(vault);
    }
}