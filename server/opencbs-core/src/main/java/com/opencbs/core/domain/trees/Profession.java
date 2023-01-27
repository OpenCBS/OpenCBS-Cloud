package com.opencbs.core.domain.trees;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Data
@Table(name = "professions")
public class Profession extends TreeEntity<Profession> {
}