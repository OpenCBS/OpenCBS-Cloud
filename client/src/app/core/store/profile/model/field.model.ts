export interface Field {
  id: number;
  fieldType: string;
  caption: string;
  unique: boolean;
  required: boolean;
  order: number;
  extra: any;
  value?: any;
}
