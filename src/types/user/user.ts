export interface UserCreateRequest {
  username: string;
  email: string;
  password: string;
  userType: string;
  cell?: string;
  address?: string;
  bcregistration?: string;
  accountTitle?: string;
  accountNumber?: string;
  bankTitle?: string;
  branch?: string;
  routingNumber?: string;
}

export interface BeneficiaryCreateRequest {
  bcRegistration?: string;
  accountTitle?: string;
  accountNumber?: string;
  bankTitle?: string;
  branch?: string;
  routingNumber?: string;
}

export enum UserMediaType {
  AVATAR = 'AVATAR',
  SIGNATURE = 'SIGNATURE'
}

export enum UserType {
  REGULAR = 'REGULAR',
  IN_ORGANIZATION = 'IN_ORGANIZATION'
}

export interface UserCreationState {
  step: 1 | 2;
  userType: UserType;
  profileData: UserCreateRequest;
  createdUserId?: string;
  avatarFile?: File;
  signatureFile?: File;
  isUpdate?: boolean;
  existingUserId?: string;
}
