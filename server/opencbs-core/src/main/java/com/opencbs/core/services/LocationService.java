package com.opencbs.core.services;

import com.opencbs.core.domain.trees.Location;
import com.opencbs.core.repositories.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class LocationService extends TreeEntityService<LocationRepository, Location> {

    private final LocationRepository locationRepository;

    @Autowired
    public LocationService(LocationRepository repository,
                           LocationRepository locationRepository) {
        super(repository);
        this.locationRepository = locationRepository;
    }

    @Override
    public Page<Location> findBy(String query, Pageable pageable) {
        return this.locationRepository.search(query, pageable);
    }

    public Location findById(Long id) {
        return this.locationRepository.findOne(id);
    }
}
