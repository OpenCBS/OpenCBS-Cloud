import { CustomFieldSectionValue } from '../../../models'

export interface Profile {
  id: number;
  type: string;
  name?: string;
  status?: string;
}

export interface IProfileList {
  profiles: Profile[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  size: number;
  numberOfElements: number;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

export interface IProfile {
  id: number;
  name?: string;
  type: string;
  status: string;
  isReadOnly: boolean;
  attachments: ProfileAttachment[],
  customFieldSections: CustomFieldSectionValue[],
  currentAccounts: ProfileCurrentAccounts[],
  loading: boolean;
  loaded: boolean;
  error: boolean;
  success: boolean;
  errorMessage: string;
}

export interface ProfileAttachment {
  id: number;
  originalFilename: string;
  contentType: string;
  createdAt: string;
  pinned: boolean;
  createdBy: any;
  comment: String;
}

export interface ProfileCurrentAccounts {
  id: number;
  code: number;
  currency: {};
}


export interface ProfilesResponse {
  content: Profile[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: any;
  first: boolean;
  numberOfElements: number;
}
