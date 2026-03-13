export interface OrphanApplication {
  id?: string;
  beneficiaryUserId?: string;
  status: ApplicationStatus;
  rejectionMessage?: string;
  primaryInformation?: PrimaryInformation;
  address?: Address;
  familyMembers?: FamilyMember[];
  basicInformation?: BasicInformation;
  verification?: Verification;
  createdAt?: string;
  updatedAt?: string;
}

export interface PrimaryInformation {
  id?: string;
  fullName: string;
  dateOfBirth: string;
  bcRegistration: string;
  nationality?: string;
  placeOfBirth?: string;
  age: number;
  gender: Gender;
  religion?: string;
  fathersName: string;
  dateOfDeath?: string;
  causeOfDeath?: string;
  mothersName?: string;
  mothersOccupation?: string;
  mothersStatus?: MothersStatus;
  fixedAssets?: string;
  annualIncome?: string;
  numOfSiblings: number;
  academicInstitution?: string;
  grade: number;
}

export interface Address {
  id?: string;
  isSameAsPermanent: boolean;
  permanentDistrict: string;
  permanentSubDistrict: string;
  permanentUnion?: string;
  permanentVillage?: string;
  permanentArea?: string;
  presentDistrict?: string;
  presentSubDistrict?: string;
  presentUnion?: string;
  presentVillage?: string;
  presentArea?: string;
}

export interface FamilyMember {
  id?: string;
  name?: string;
  age?: number;
  siblingsGrade?: number;
  occupation?: string;
  siblingsGender?: Gender;
  maritalStatus?: MaritalStatus;
}

export interface BasicInformation {
  id?: string;
  physicalCondition: PhysicalCondition;
  hasCriticalIllness: boolean;
  typeOfIllness?: string;
  isResident: boolean;
  residenceStatus?: ResidenceStatus;
  houseType?: HouseType;
  bedroom?: number;
  balcony: boolean;
  kitchen: boolean;
  store: boolean;
  hasTubeWell: boolean;
  toilet: boolean;
  guardiansName?: string;
  guardiansRelation?: string;
  NID?: string;
  cell1?: string;
  cell2?: string;
}

export interface Verification {
  id?: string;
  agentUserId?: string;
  authenticatorUserId?: string;
  investigatorUserId?: string;
  qcSwdUserId?: string;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export enum MothersStatus {
  WIDOWED = 'WIDOWED',
  REMARRIED = 'REMARRIED',
  DEAD = 'DEAD'
}

export enum PhysicalCondition {
  HEALTHY = 'HEALTHY',
  SICK = 'SICK',
  DISABLED = 'DISABLED'
}

export enum ResidenceStatus {
  OWN = 'OWN',
  RENTED = 'RENTED',
  SHELTERED = 'SHELTERED',
  HOMELESS = 'HOMELESS'
}

export enum HouseType {
  CONCRETE_HOUSE = 'CONCRETE_HOUSE',
  SEMI_CONCRETE_HOUSE = 'SEMI_CONCRETE_HOUSE',
  MUD_HOUSE = 'MUD_HOUSE'
}

export enum MaritalStatus {
  UNMARRIED = 'UNMARRIED',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED'
}

export enum ApplicationStatus {
  NEW = 'NEW',
  INCOMPLETE = 'INCOMPLETE',
  COMPLETE = 'COMPLETE',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
  GRANTED = 'GRANTED'
}

export enum DocumentType {
  BIRTH_CERTIFICATE = 'BIRTH_CERTIFICATE',
  TESTIMONIAL = 'TESTIMONIAL',
  DEATH_CERTIFICATE = 'DEATH_CERTIFICATE',
  NATIONAL_ID = 'NATIONAL_ID',
  PASSPORT_IMAGE = 'PASSPORT_IMAGE',
  FULL_SIZE_IMAGE = 'FULL_SIZE_IMAGE'
}

export interface ApplicationMedia {
  id: string;
  orphanApplicationId: string;
  type: DocumentType;
  s3Key: string;
  uploadedAt: string;
}

export interface ValidationError {
  field: string;
  message: string;
  tab?: string;
}

export interface TabData {
  id: string;
  label: string;
  component: React.ComponentType<any>;
  isValid: boolean;
  hasErrors: boolean;
}