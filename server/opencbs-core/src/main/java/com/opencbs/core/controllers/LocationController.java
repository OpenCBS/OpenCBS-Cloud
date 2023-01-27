package com.opencbs.core.controllers;

import com.opencbs.core.domain.trees.Location;
import com.opencbs.core.dto.TreeEntityDto;
import com.opencbs.core.dto.UpdateTreeEntityDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.LocationMapper;
import com.opencbs.core.services.LocationService;
import com.opencbs.core.validators.LocationDtoValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

@RestController
@RequestMapping(value = "/api/locations")
@SuppressWarnings("unused")
public class LocationController {

    private final LocationService locationService;
    private final LocationMapper locationMapper;
    private final LocationDtoValidator locationDtoValidator;

    @Autowired
    public LocationController(
            LocationService locationService,
            LocationMapper locationMapper,
            LocationDtoValidator locationDtoValidator) {
        this.locationService = locationService;
        this.locationMapper = locationMapper;
        this.locationDtoValidator = locationDtoValidator;
    }

    @RequestMapping(method = GET)
    public List<TreeEntityDto> get() {
        List<Location> locations = this.locationService.findAll();
        return locations
                .stream()
                .filter(x -> x.getParent() == null)
                .map(x -> this.locationMapper.map(x, locations))
                .collect(Collectors.toList());
    }

    @RequestMapping(value = "/lookup", method = GET)
    public Page<Location> get(@RequestParam(value = "search", required = false) String query, Pageable pageable) {
        return this.locationService.findBy(query, pageable);
    }

    @RequestMapping(path = "/{id}", method = GET)
    public TreeEntityDto get(@PathVariable long id) throws ResourceNotFoundException {
        Location location = this.locationService
                .findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Location not found (ID=%d).", id)));

        return this.locationMapper.map(location, this.locationService.findAll());
    }

    @RequestMapping(method = POST)
    public TreeEntityDto post(@RequestBody UpdateTreeEntityDto updateTreeEntityDto) throws Exception {
        this.locationDtoValidator.validate(updateTreeEntityDto);
        Location location = this.locationMapper.map(updateTreeEntityDto);
        location = this.locationService.create(location);

        // A new location does not have children, thus it is safe to set the second
        // parameter to an empty list in map().
        return this.locationMapper.map(location, new ArrayList<>());
    }

    @RequestMapping(path = "/{id}", method = PUT)
    public TreeEntityDto put(@PathVariable long id, @RequestBody UpdateTreeEntityDto updateTreeEntityDto) throws Exception {
        Location location = this.locationService
                .findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Location not found (ID=%d).", id)));
        updateTreeEntityDto.setId(id);
        this.locationDtoValidator.validate(updateTreeEntityDto);
        location = this.locationMapper.zip(location, updateTreeEntityDto);
        location = this.locationService.update(location);

        return this.locationMapper.map(location, this.locationService.findAll());
    }
}
