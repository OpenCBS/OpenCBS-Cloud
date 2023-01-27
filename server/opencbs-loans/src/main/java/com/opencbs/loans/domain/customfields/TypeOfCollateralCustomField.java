package com.opencbs.loans.domain.customfields;

import com.opencbs.core.domain.customfields.CustomField;
import lombok.Data;
import org.hibernate.annotations.Where;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "types_of_collateral_custom_fields")
@Data
@Where(clause = "deleted = false")
public class TypeOfCollateralCustomField extends CustomField<TypeOfCollateral> {}
