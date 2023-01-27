export interface Field {
  id?: number;
  sectionId?: number;
  name: string;
  caption: string;
  description: string;
  fieldType: string;
  unique?: boolean;
  required?: boolean;
  order?: number;
  extra?: any;
}

export interface Section {
  id?: number;
  caption: string;
  order?: number;
  customFields?: Field[];
}
