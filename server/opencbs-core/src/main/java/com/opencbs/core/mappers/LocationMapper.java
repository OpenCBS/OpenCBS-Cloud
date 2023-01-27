package com.opencbs.core.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.trees.Location;
import com.opencbs.core.services.LocationService;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper
public class LocationMapper extends TreeEntityMapper<LocationService, Location> {
    @Autowired
    public LocationMapper(LocationService service) {
        super(service, Location.class);
    }
}
