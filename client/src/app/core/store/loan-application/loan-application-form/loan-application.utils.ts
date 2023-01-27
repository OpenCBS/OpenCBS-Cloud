import { IEntryFeeItem } from './loan-application-form.interfaces';
import * as Big from 'big.js';

export const deepCopy = (array) => {
  const newArray = [];
  if (array.length) {
    array.map(item => {
      newArray.push(Object.assign({}, item));
    });
  }
  return newArray;
};

export const addLocalId = (array) => {
  array.map((item, i) => {
    const newItem = Object.assign({}, item, {
      localId: ++i
    })
  });
  return array;
};

export const addUniqueLocalId = (array: any[]) => {
  const ids = array
  .map(item => item['id']);
  return !!ids.length ? Math.max.apply(null, ids) + 1 : 1;
};

export const countTotal = (array): string | number => {
  let total = '0';
  array.map(item => {
    if (item && item.amount) {
      total = Big(total).plus(item.amount).valueOf();
    }
  });
  return +total;
};

export const formatEntryFees = (entryFees: any[]): IEntryFeeItem[] => {
  const fees = [];
  entryFees
  .sort(compareValues('id'))
  .map(fee => {
    fees.push({
      id: fee.id,
      name: fee.name,
      amount: 0,
      code: fee.name.toLowerCase().trim().split(' ').join('_').replace(/\'/g, ''),
      edited: false,
      minValue: fee.minValue,
      maxValue: fee.maxValue,
      minLimit: fee.minLimit,
      maxLimit: fee.maxLimit,
      percentage: fee.percentage
    });
  });
  return fees;
};

export const compareValues = (key, order = 'asc') => {
  return (a, b) => {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }

    const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return ((order === 'desc') ? (comparison * -1) : comparison);
  };
};

export const checkFormValidity = (form, excludedItemKey?: string): boolean => {
  let valid = true;
  if (Object.keys(form).length >= 9) {
    for (let key in form) {
      if (form.hasOwnProperty(key) && valid) {
        if (excludedItemKey ? key !== excludedItemKey : false) {
          valid = form[key] === 0 || !!form[key];
        }
      }
    }
  } else {
    valid = false;
  }
  return valid;
};

export const flattenString = (str: string) => {
  return str.toLowerCase().trim().split(' ').join('_').replace(/\'/g, '');
};

export const inRange = (num: number, range: number[]) => {
  return num >= range[0] && num <= range[1];
};
