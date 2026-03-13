import * as Yup from 'yup';
import { Gender, MaritalStatus, HouseType, ResidenceStatus } from '../types';

export const patientFamilyMemberSchema = Yup.object({
  name: Yup.string().required('Family member name is required').trim(),
  age: Yup.number()
    .required('Age is required')
    .typeError('Age must be a number')
    .min(0, 'Age cannot be negative'),
  maritalStatus: Yup.mixed<MaritalStatus>()
    .oneOf(Object.values(MaritalStatus), 'Please select a valid status')
    .required('Marital status is required'),
  grade: Yup.number()
    .nullable()
    .transform((value, originalValue) => originalValue === '' || originalValue === null ? null : value)
    .min(0, 'Grade cannot be negative'),
  occupation: Yup.string().trim(),
});

export const patientInformationSchema = Yup.object({
  code: Yup.string().trim(),
  fullName: Yup.string().required('Full name is required').trim(),
  bcRegistration: Yup.string().trim(),
  dateOfBirth: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future'),
  gender: Yup.mixed<Gender>()
    .oneOf(Object.values(Gender), 'Please select a gender')
    .required('Gender selection is required'),
  fathersName: Yup.string().required("Father's name is required").trim(),
  fathesProfession: Yup.string().trim(),
  mothersName: Yup.string().required("Mother's name is required").trim(),
  mothersProfession: Yup.string().trim(),
  annualIncome: Yup.string().trim(),
  familyMemberCount: Yup.string().trim(),
});

export const patientAddressSchema = Yup.object({
  isSameAsPermanent: Yup.boolean(),
  permanentDistrict: Yup.string().required('Permanent district is required').trim(),
  permanentSubDistrict: Yup.string().required('Permanent sub-district is required').trim(),
  permanentUnion: Yup.string().required('Permanent union is required').trim(),
  permanentVillage: Yup.string().required('Permanent village is required').trim(),
  permanentArea: Yup.string().trim(),
  presentDistrict: Yup.string().when('isSameAsPermanent', {
    is: false,
    then: (schema) => schema.required('Present district is required'),
    otherwise: (schema) => schema,
  }).trim(),
  presentSubDistrict: Yup.string().when('isSameAsPermanent', {
    is: false,
    then: (schema) => schema.required('Present sub-district is required'),
    otherwise: (schema) => schema,
  }).trim(),
  presentUnion: Yup.string().when('isSameAsPermanent', {
    is: false,
    then: (schema) => schema.required('Present union is required'),
    otherwise: (schema) => schema,
  }).trim(),
  presentVillage: Yup.string().when('isSameAsPermanent', {
    is: false,
    then: (schema) => schema.required('Present village is required'),
    otherwise: (schema) => schema,
  }).trim(),
  presentArea: Yup.string().trim(),
});

export const householdInformationSchema = Yup.object({
  houseStatus: Yup.mixed<ResidenceStatus>()
    .oneOf(Object.values(ResidenceStatus), 'Please select a valid residence status')
    .nullable(),
  houseType: Yup.mixed<HouseType>()
    .oneOf(Object.values(HouseType), 'Please select a valid house type')
    .nullable(),
  numOfRooms: Yup.number()
    .nullable()
    .transform((value, originalValue) => originalValue === '' || originalValue === null ? null : value)
    .min(0, 'Number of rooms cannot be negative'),
  houseSize: Yup.string().trim(),
  plotSize: Yup.string().trim(),
  landSize: Yup.string().trim(),
  hasTubeWell: Yup.boolean(),
  hasLatrine: Yup.boolean(),
});

const phoneRegex = /^0\d{2}\s\d{4}\s\d{4}$/;

export const contactInformationSchema = Yup.object({
  relativeContacts: Yup.object()
    .test(
      'max-contacts',
      'Maximum 3 relative contacts allowed',
      (value) => !value || Object.keys(value).length <= 3
    )
    .test(
      'valid-phone-format',
      'All phone numbers must be in format: 017 0602 0534 (11 digits with spaces)',
      function(value) {
        if (!value) return true;
        const phones = Object.values(value);
        return phones.every(phone => !phone || phoneRegex.test(phone as string));
      }
    ),
  email: Yup.string().email('Invalid email format').trim(),
  additionalComment: Yup.string().trim(),
});

export const medicalApplicationSchema = Yup.object({
  patientInformation: patientInformationSchema,
  patientAddress: patientAddressSchema,
  householdInformation: householdInformationSchema,
  contactInformation: contactInformationSchema,
  patientFamilyMembers: Yup.array().of(patientFamilyMemberSchema),
});

export const partialPatientInformationSchema = Yup.object({
  fullName: Yup.string().required('Full name is required').trim(),
  dateOfBirth: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future'),
  gender: Yup.mixed<Gender>()
    .oneOf(Object.values(Gender), 'Please select a gender')
    .required('Gender selection is required'),
  fathersName: Yup.string().required("Father's name is required").trim(),
  mothersName: Yup.string().required("Mother's name is required").trim(),
});

export const partialPatientAddressSchema = Yup.object({
  permanentDistrict: Yup.string().trim(),
  permanentSubDistrict: Yup.string().trim(),
  permanentUnion: Yup.string().trim(),
  permanentVillage: Yup.string().trim(),
});

export const partialMedicalApplicationSchema = Yup.object({
  patientInformation: partialPatientInformationSchema,
  patientAddress: partialPatientAddressSchema.nullable(),
  householdInformation: Yup.object().nullable(),
  contactInformation: Yup.object().nullable(),
  patientFamilyMembers: Yup.array().of(patientFamilyMemberSchema),
});
