import { FormGroup } from '@angular/forms';
import { FieldConfigSystemSettings } from './field-system-settings-config.interface';

export interface FieldSystemSettings {
  config: FieldConfigSystemSettings;
  group: FormGroup;
  style: Object;
  styleClass: string;
}
