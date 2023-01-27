package com.opencbs.core.validators;

import com.opencbs.core.domain.trees.TreeEntity;
import com.opencbs.core.dto.UpdateTreeEntityDto;
import com.opencbs.core.services.TreeEntityService;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.util.Optional;

public abstract class TreeEntityDtoValidator<Ts extends TreeEntityService> {

    private final Ts service;

    public TreeEntityDtoValidator(Ts service) {
        this.service = service;
    }

    public void validate(UpdateTreeEntityDto updateTreeEntityDto) {
        Assert.isTrue(!StringUtils.isEmpty(updateTreeEntityDto.getName()), "Name is required.");
        Assert.isTrue(!StringUtils.isEmpty(updateTreeEntityDto.getName().trim()), "Name is required.");

        Long parentId = updateTreeEntityDto.getParentId();
        if (parentId == null) {
            this.validateName(updateTreeEntityDto);
            return;
        }
        Optional<TreeEntity> parent = this.service.findOne(parentId);
        Assert.isTrue(parent.isPresent(), String.format("Parent not found (ID=%d).", parentId));
        this.validateNameAndParent(updateTreeEntityDto, parent);
    }

    private void validateName(UpdateTreeEntityDto updateTreeEntityDto) {
        Optional<TreeEntity> existingEntity = this.service.findByName(updateTreeEntityDto.getName());

        if (existingEntity.isPresent()) {
            TreeEntity treeEntity = existingEntity.get();
            Assert.isTrue(treeEntity.getId().equals(updateTreeEntityDto.getId()), "Name is taken.");
        }
    }

    private void validateNameAndParent(UpdateTreeEntityDto updateTreeEntityDto, Optional<TreeEntity> parent){
        Optional<TreeEntity> existingNameAndParent = this.service.findByNameAndParent(updateTreeEntityDto.getName(), parent.get());

        if (existingNameAndParent.isPresent()) {
            TreeEntity treeEntity = existingNameAndParent.get();
            if (treeEntity.getParent().getId().equals(updateTreeEntityDto.getParentId())) {
                Assert.isTrue(treeEntity.getId().equals(updateTreeEntityDto.getId()), "Name is taken.");
            }
        }
    }
}
