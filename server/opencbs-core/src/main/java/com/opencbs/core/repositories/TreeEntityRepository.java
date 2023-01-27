package com.opencbs.core.repositories;

import com.opencbs.core.domain.trees.TreeEntity;
import com.opencbs.core.repositories.customs.TreeEntityRepositoryCustom;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.Optional;

@NoRepositoryBean
public interface TreeEntityRepository<Tte extends TreeEntity> extends Repository<Tte>, TreeEntityRepositoryCustom<Tte> {

    Optional<Tte> findByName(String name);
    Optional<Tte> findByNameAndParent(String name, Tte parent);
}
