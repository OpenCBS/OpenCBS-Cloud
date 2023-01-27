package com.opencbs.core.domain.trees;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "locations")
public class Location extends TreeEntity<Location> {
}
