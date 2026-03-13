import { ApplicationStatus, Gender, MaritalStatus, HouseType, ResidenceStatus } from './application';

export enum SurgeryType {
  HEART_SURGERY = 'HEART_SURGERY',
  EYE_SURGERY = 'EYE_SURGERY'
}

export enum MedicalDocumentType {
  APPLICATION_FORM = 'APPLICATION_FORM',
  BIRTH_CERTIFICATE = 'BIRTH_CERTIFICATE',
  CHAIRMAN_CERTIFICATE = 'CHAIRMAN_CERTIFICATE',
  FATHERS_NID = 'FATHERS_NID',
  MOTHERS_NID = 'MOTHERS_NID',
  PASSPORT_IMAGE = 'PASSPORT_IMAGE'
}

export enum PatientRelation {
  SELF = 'SELF',
  FATHER = 'FATHER',
  MOTHER = 'MOTHER',
  BROTHER = 'BROTHER',
  SISTER = 'SISTER',
  OTHERS = 'OTHERS'
}

export interface PatientInformation {
  id?: string;
  code?: string;
  fullName: string;
  bcRegistration?: string;
  dateOfBirth: string;
  gender: Gender;
  fathersName: string;
  fathesProfession?: string;
  mothersName: string;
  mothersProfession?: string;
  annualIncome?: string;
  familyMemberCount?: string;
}

export interface PatientFamilyMember {
  id?: string;
  name: string;
  age: number;
  maritalStatus: MaritalStatus;
  grade: number;
  occupation: string;
}

export interface PatientAddress {
  id?: string;
  isSameAsPermanent: boolean;
  permanentDistrict: string;
  permanentSubDistrict: string;
  permanentUnion: string;
  permanentVillage: string;
  permanentArea?: string;
  presentDistrict: string;
  presentSubDistrict: string;
  presentUnion: string;
  presentVillage: string;
  presentArea?: string;
}

export interface HouseholdInformation {
  id?: string;
  houseStatus?: ResidenceStatus;
  houseType?: HouseType;
  numOfRooms?: number;
  houseSize?: string;
  plotSize?: string;
  landSize?: string;
  hasTubeWell: boolean;
  hasLatrine: boolean;
}

export interface RelativeContact {
  cell: string;
}

export interface ContactInformation {
  id?: string;
  relativeContacts?: Partial<Record<PatientRelation, string>>;
  email?: string;
  additionalComment?: string;
}

export interface MedicalApplication {
  id?: string;
  surgeryType: SurgeryType;
  status: ApplicationStatus;
  rejectionMessage?: string;
  version?: number;
  createdBy?: string;
  lastReviewedBy?: string;
  createdAt?: string;
  lastModifiedAt?: string;
  patientInformation: PatientInformation;
  patientFamilyMembers: PatientFamilyMember[];
  householdInformation: HouseholdInformation;
  patientAddress: PatientAddress;
  contactInformation: ContactInformation;
}

export interface MedicalApplicationCreateDTO {
  status: ApplicationStatus;
  patientInformation: PatientInformation;
  householdInformation: HouseholdInformation;
  patientAddress: PatientAddress;
  contactInformation: ContactInformation;
  patientFamilyMemberDTOList: PatientFamilyMember[];
}

export interface MedicalApplicationUpdateDTO {
  status?: ApplicationStatus;
  rejectionMessage?: string;
  patientInformation?: PatientInformation;
  householdInformation?: HouseholdInformation;
  patientAddress?: PatientAddress;
  contactInformation?: ContactInformation;
  patientFamilyMemberDTOList?: PatientFamilyMember[];
}

export interface MedicalApplicationSummaryDTO {
  id: string;
  code?: string;
  fullName: string;
  dateOfBirth?: string;
  fathersName?: string;
  gender?: Gender;
  status: ApplicationStatus;
}

export interface MedicalApplicationFilters {
  status?: string;
  createdBy?: string;
  createdStartDate?: string;
  createdEndDate?: string;
  lastModifiedStartDate?: string;
  lastModifiedEndDate?: string;
  fullName?: string;
  gender?: string;
  dobStart?: string;
  dobEnd?: string;
  fathersName?: string;
  mothersName?: string;
  permanentDistrict?: string;
  permanentSubDistrict?: string;
  permanentUnion?: string;
  presentDistrict?: string;
  presentSubDistrict?: string;
  presentUnion?: string;
  sortField?: string;
  sortDirection?: string;
  page?: number;
  size?: number;
}

export const createEmptyMedicalApplication = (type: SurgeryType): MedicalApplication => ({
  surgeryType: type,
  status: ApplicationStatus.NEW,
  patientInformation: {
    fullName: '',
    dateOfBirth: '',
    gender: Gender.MALE,
    fathersName: '',
    fathesProfession: '',
    mothersName: '',
    mothersProfession: '',
    annualIncome: '',
    familyMemberCount: '',
    bcRegistration: '',
  },
  patientFamilyMembers: [],
  householdInformation: {
    houseStatus: undefined,
    houseType: undefined,
    numOfRooms: 0,
    houseSize: '',
    plotSize: '',
    landSize: '',
    hasTubeWell: false,
    hasLatrine: false,
  },
  patientAddress: {
    isSameAsPermanent: false,
    permanentDistrict: '',
    permanentSubDistrict: '',
    permanentUnion: '',
    permanentVillage: '',
    permanentArea: '',
    presentDistrict: '',
    presentSubDistrict: '',
    presentUnion: '',
    presentVillage: '',
    presentArea: '',
  },
  contactInformation: {
    relativeContacts: {},
    email: '',
    additionalComment: '',
  },
});

export const createEmptyPatientFamilyMember = (): PatientFamilyMember => ({
  name: '',
  age: 0,
  maritalStatus: MaritalStatus.UNMARRIED,
  grade: 0,
  occupation: '',
});
