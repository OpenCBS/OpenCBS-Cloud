export const escapeDoubleQuotes = (str) => {
  return str.replace(/\\([\s\S])|(")/g, '\\$1$2');
};

export const unescapeDoubleQuotes = (str) => {
  return str.replace(/\\"/g, '"');
};

export const flattenString = (str: string) => {
  return str.toLowerCase().trim().split(' ').join('_').replace(/\'/g, '');
};

export const checkPermissions = (userPermissions, requiredPermission) => {
  return userPermissions.some(item => {
    if (item['group'] === requiredPermission['group']) {
      return item['permissions'].some(a => {
        if (Array.isArray(requiredPermission['permissions'])) {
          return requiredPermission['permissions'].some(elem => {
            return elem === a;
          });
        } else {
          return a === requiredPermission['permissions'];
        }
      })
    }
  });
};
