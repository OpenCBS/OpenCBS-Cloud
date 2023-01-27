package com.opencbs.core.domain.trees;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "business_sectors")
public class BusinessSector extends TreeEntity<BusinessSector> {
}
