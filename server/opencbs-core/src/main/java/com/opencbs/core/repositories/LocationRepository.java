package com.opencbs.core.repositories;

import com.opencbs.core.domain.trees.Location;
import com.opencbs.core.repositories.customs.LocationsRepositoryCustom;

public interface LocationRepository extends TreeEntityRepository<Location>, LocationsRepositoryCustom {
}
