export interface CustomFieldSectionValue {
  id: number;
  caption: string;
  order: number;
  values: CustomFieldValue[];
}

export interface CustomFieldSectionMeta {
  id: number;
  caption: string;
  order: number;
  customFields: CustomFieldMeta[];
}

export interface CustomFieldValue {
  value: string;
  customField: CustomFieldMeta
}

export interface CustomFieldMeta {
  id?: number;
  name: string;
  caption: string;
  fieldType: string;
  unique: boolean;
  required: boolean;
  order?: number;
  extra?: string;
  value?: string;
  sectionId?: number;
}
