// Checks if provided role data is similar with the cached one
export const checkRoleFormChanges = (data, cachedData) => {
  let status = false;
  const permissionStrings = [];
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      if (data['name'] !== cachedData.name) {
        status = true;
      }
      if (key !== 'name' && data[key]) {
        permissionStrings.push(key);
      }
    }
  }

  if (cachedData.permissions && permissionStrings.length !== cachedData.permissions.length) {
    status = true;
  }

  permissionStrings.map(item => {
    if (!cachedData.permissions.some(el => el === item)) {
      status = true;
    }
  });

  return status;
};


export const generateRoleGroups = (data) => {
  return data.map(a => {
    return {
      group: a.group,
      permissions: a.permissions.map(perm => {
        return {
          name: perm,
          checked: false,
          disabled: false
        }
      })
    }
  });
};

export const generateSubmitData = (data) => {
  const permissions = [];
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      if (key !== 'name' && key !== 'statusType' && data[key]) {
        permissions.push(key);
      }
    }
  }

  return {
    name: data.name,
    statusType: data.statusType,
    permissions: permissions
  };
};
