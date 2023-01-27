package com.opencbs.core.repositories.customs;

import com.opencbs.core.domain.trees.Location;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LocationsRepositoryCustom {

    Page<Location> search(String query, Pageable pageable);
}
