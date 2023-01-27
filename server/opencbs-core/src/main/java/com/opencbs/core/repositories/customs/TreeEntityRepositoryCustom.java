package com.opencbs.core.repositories.customs;

import com.opencbs.core.domain.trees.TreeEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TreeEntityRepositoryCustom<Tte extends TreeEntity> {

    Page<Tte> findBy(String query, Pageable pageable);
    Page<Tte> findLeaves(Pageable pageable);
}
