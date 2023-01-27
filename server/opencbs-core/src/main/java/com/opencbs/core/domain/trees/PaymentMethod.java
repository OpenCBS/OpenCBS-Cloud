package com.opencbs.core.domain.trees;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Data
@Table(name = "payment_methods")
public class PaymentMethod extends TreeEntity<PaymentMethod> {
}
