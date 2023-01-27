import { CustomFieldSectionValue } from '../../models';
import { environment } from '../../../../environments/environment';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

export const getProfileId = () => {
  return state => state
    .pipe(map(s => s['id']), distinctUntilChanged());
};

export const getProfileType = () => {
  return state => state
    .pipe(map(s => s['type']), distinctUntilChanged());
};

export const getProfileStatus = () => {
  return state => state
    .pipe(map(s => s['status']), distinctUntilChanged());
};

export const getCurrentProfileFields = () => {
  return state => state
    .pipe(map(s => s['customFieldSections']),
      map((sections: CustomFieldSectionValue[]) => {
        const newSections = sections.map((section: CustomFieldSectionValue) => {
          const fieldsArray = [];
          section.values.map(item => {
            const tempObj = {};
            if ( item['value'] ) {
              tempObj['value'] = item['value'];
            }

            let fieldMeta;
            if ( item['customField'] ) {
              fieldMeta = item['customField'];
            } else {
              fieldMeta = item;
            }

            for (const key in fieldMeta) {
              if ( fieldMeta.hasOwnProperty(key) ) {
                tempObj[key] = fieldMeta[key];
              }
            }

            if ( tempObj['fieldType'] === 'LOOKUP' && tempObj['extra'] && tempObj['extra']['key'] ) {
              let defaultValue = tempObj['value'] && tempObj['value'].name ? tempObj['value'].name : '';
              tempObj['extra'] = Object.assign({}, tempObj['extra'], {
                url: `${environment.API_ENDPOINT}${tempObj['extra']['key']}/lookup`,
                defaultQuery: defaultValue
              });
            }

            fieldsArray.push(tempObj);
          });

          fieldsArray.sort((a, b) => {
            return a.order - b.order;
          });
          section = Object.assign({}, section, {
            values: fieldsArray
          });
          return section;
        });

        return newSections.sort((a, b) => {
          return a.order - b.order;
        });
      }), distinctUntilChanged());
};

export const getProfileCustomFields = () => {
  return state => state
    .pipe(map(s => {
      const profileFields = [];
      s['profileFields'].map(section => {
        const newArray = [];
        section.customFields.map(field => {
          if ( field.fieldType === 'LOOKUP' && field.extra && field.extra.key ) {
            field = Object.assign({}, field, {
              extra: {
                key: field.extra.key,
                url: `${environment.API_ENDPOINT}${field.extra.key}/lookup`
              }
            });
          }
          newArray.push(field)
        });
        section = Object.assign({}, section, {
          customFields: newArray
        });
        profileFields.push(section);
      });
      const res = Object.assign({}, s, {
        profileFields: profileFields
      });
      return res.profileFields.sort((a, b) => {
        return a.order - b.order;
      });
    }), distinctUntilChanged());
};

export const getProfilesCurrentPage = () => {
  return state => state
    .pipe(map(s => s['currentPage']));
};
