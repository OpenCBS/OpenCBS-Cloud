package com.opencbs.core.mappers;

import com.opencbs.core.domain.trees.TreeEntity;
import com.opencbs.core.dto.TreeEntityDto;
import com.opencbs.core.dto.UpdateTreeEntityDto;
import com.opencbs.core.services.TreeEntityService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

public abstract class TreeEntityMapper<Ts extends TreeEntityService, Tte extends TreeEntity> {

    private final Ts service;
    private final Class<Tte> entityClass;

    public TreeEntityMapper(Ts service, Class<Tte> entityClass) {
        this.service = service;
        this.entityClass = entityClass;
    }

    public List<TreeEntityDto> map(List<Tte> entities) {
        return entities
                .stream()
                .map(x -> map(x, entities))
                .collect(Collectors.toList());
    }

    public TreeEntityDto map(TreeEntity entity, List<Tte> entities) {
        TreeEntityDto dto = new TreeEntityDto();
        Map<String, Object> data = new HashMap<>();
        data.put("id", entity.getId());
        data.put("name", entity.getName());
        dto.setData(data);

        Map<String, Object> parent = null;
        if (entity.getParent() != null) {
            parent = new HashMap<>();
            parent.put("id", entity.getParent().getId());
            parent.put("name", entity.getParent().getName());
        }
        dto.setParent(parent);

        dto.setChildren(entities
                        .stream()
                        .filter(x -> x.getParent() != null && x.getParent().getId().equals(entity.getId()))
                        .map(x -> map(x, entities))
                        .collect(Collectors.toList())
        );

        return dto;
    }

    public Tte map(UpdateTreeEntityDto updateTreeEntityDto) throws Exception {
        Tte entity = this.entityClass.newInstance();
        entity.setName(updateTreeEntityDto.getName());
        if (updateTreeEntityDto.getParentId() != null) {
            Optional<Tte> parentLocation = this.service.findOne(updateTreeEntityDto.getParentId());
            parentLocation.ifPresent(entity::setParent);
        }
        return entity;
    }

    public Tte zip(Tte treeEntity, UpdateTreeEntityDto updateTreeEntityDto) throws Exception {
        Tte entity = this.map(updateTreeEntityDto);
        entity.setId(treeEntity.getId());
        return entity;
    }
}
