package com.opencbs.loans.domain.customfields;

import com.opencbs.core.domain.customfields.CustomFieldSection;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Data
@Table(name = "types_of_collateral")
public class TypeOfCollateral extends CustomFieldSection<TypeOfCollateralCustomField> {
}
