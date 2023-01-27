import { Role } from '../../roles';

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: Role;
}
