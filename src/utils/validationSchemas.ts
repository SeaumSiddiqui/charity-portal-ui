import * as Yup from 'yup';
import { Gender, MothersStatus, PhysicalCondition, ResidenceStatus, HouseType, MaritalStatus } from '../types';

// Common validation schemas
export const commonValidationSchemas = {
  requiredString: Yup.string().required('This field is required').trim(),
  optionalString: Yup.string().trim(),
  requiredEmail: Yup.string().email('Please enter a valid email address').required('Email is required'),
  optionalEmail: Yup.string().email('Invalid email format'),
  requiredNumber: Yup.number().required('This field is required').min(0, 'Value must be 0 or greater'),
  optionalNumber: Yup.number().min(0, 'Must be a positive number'),
  requiredAge: Yup.number().required('Age is required').min(0, 'Age must be 0 or greater').max(18, 'Age must be 18 or under for orphan eligibility'),
  requiredDate: Yup.date().required('Please select a date').max(new Date(), 'Date cannot be in the future'),
  optionalDate: Yup.date().max(new Date(), 'Date cannot be in the future'),
  phoneNumber: Yup.string()
    .matches(/^\+880\d{2}-\d{4}-\d{4}$/, 'Phone number must be in format +88017-0602-0534')
    .test('valid-bd-number', 'Please enter a valid Bangladesh phone number', (value) => {
      if (!value) return true; // Allow empty (optional fields)
      // Remove formatting to check if it's exactly 11 digits after +880
      const digitsOnly = value.replace(/[^\d]/g, '').slice(3); // Remove country code
      return digitsOnly.length === 10;
    }),
  bcRegistration: Yup.string().required('Birth Certificate Registration number is required').trim(),
  postalCode: Yup.string().matches(/^\d{4}$/, 'Postal code must be 4 digits'),
};

// Primary Information Schema (Complete Validation)
export const primaryInformationSchema = Yup.object({
  fullName: Yup.string().required('Full name is required').trim(),
  dateOfBirth: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future')
    .test('date-relationship', 'Date of birth must be within 10 months after date of death', function(dateOfBirth) {
      const { dateOfDeath } = this.parent;
      if (!dateOfBirth || !dateOfDeath) return true;

      const birthDate = new Date(dateOfBirth);
      const deathDate = new Date(dateOfDeath);
      const timeDifference = birthDate.getTime() - deathDate.getTime();

      // Only validate if dateOfBirth is AFTER dateOfDeath
      if (timeDifference > 0) {
        // Calculate 10 months in milliseconds (approximately 10 * 30 days)
        const tenMonthsMs = 10 * 30 * 24 * 60 * 60 * 1000;

        if (timeDifference > tenMonthsMs) {
          return this.createError({
            message: 'Date of birth must be within 10 months after date of death'
          });
        }
      }

      return true;
    }),
  bcRegistration: commonValidationSchemas.bcRegistration,
  placeOfBirth: Yup.string().required('Place of birth is required').trim(),
  age: Yup.number()
    .required('Age is required')
    .typeError('Age must be a number')
    .integer('Age must be a whole number')
    .min(5, 'Age must be at least 5 years for orphan eligibility')
    .max(11, 'Age must be 11 or under for orphan eligibility'),
  gender: Yup.mixed<Gender>().oneOf(Object.values(Gender), 'Please select a gender').required('Gender selection is required'),
  fathersName: Yup.string().required("Father's name is required").trim(),
  dateOfDeath: Yup.date()
    .required("Father's date of death is required")
    .max(new Date(), 'Date of death cannot be in the future'),
  causeOfDeath: Yup.string().required('Cause of death is required').trim(),
  mothersName: Yup.string().required("Mother's name is required").trim(),
  mothersOccupation: Yup.string()
    .required("Mother's occupation is required")
    .oneOf(
      ['গৃহিণী', 'শ্রমিক', 'গৃহপরিচারিকা', 'চাকরিজীবী', 'ব্যাবসায়ী', 'অন্যান্য'],
      "Please select a valid mother's occupation"
    ),
  mothersStatus: Yup.mixed<MothersStatus>().oneOf(Object.values(MothersStatus), 'Please select mother\'s status').required("Mother's status is required"),
  fixedAssets: Yup.string().required('Fixed assets information is required').trim(),
  annualIncome: Yup.string().required('Annual income information is required').trim(),
  numOfSiblings: Yup.number().required('Number of siblings is required').min(0, 'Number of siblings cannot be negative'),
  academicInstitution: Yup.string().required('Academic institution is required').trim(),
  grade: Yup.number()
    .required('Current grade/class is required')
    .typeError('Grade must be a number')
    .min(0, 'Grade cannot be negative'),
});

// Address Schema (Complete Validation)
export const addressSchema = Yup.object({
  isSameAsPermanent: Yup.boolean(),
  permanentDistrict: Yup.string().required('Permanent district is required').trim(),
  permanentSubDistrict: Yup.string().required('Permanent sub-district is required').trim(),
  permanentUnion: Yup.string().required('Permanent union is required').trim(),
  permanentVillage: Yup.string().required('Permanent village is required').trim(),
  permanentArea: Yup.string().required('Permanent area is required').trim(),
  presentDistrict: Yup.string().when('isSameAsPermanent', {
    is: false,
    then: (schema) => schema.required('Present district is required').trim(),
    otherwise: (schema) => schema,
  }),
  presentSubDistrict: Yup.string().when('isSameAsPermanent', {
    is: false,
    then: (schema) => schema.required('Present sub-district is required').trim(),
    otherwise: (schema) => schema,
  }),
  presentUnion: Yup.string().when('isSameAsPermanent', {
    is: false,
    then: (schema) => schema.required('Present union is required').trim(),
    otherwise: (schema) => schema,
  }),
  presentVillage: Yup.string().when('isSameAsPermanent', {
    is: false,
    then: (schema) => schema.required('Present village is required').trim(),
    otherwise: (schema) => schema,
  }),
  presentArea: Yup.string().when('isSameAsPermanent', {
    is: false,
    then: (schema) => schema.required('Present area is required').trim(),
    otherwise: (schema) => schema,
  }),
});

// Family Member Schema (validates when used in context of siblings)
export const familyMemberSchema = Yup.object({
  name: Yup.string().required('Family member name is required').trim(),
  age: Yup.number()
    .required('Age is required')
    .typeError('Age must be a number')
    .min(0, 'Age cannot be negative'),
  siblingsGrade: Yup.number()
    .nullable()
    .transform((value, originalValue) => originalValue === '' || originalValue === null ? null : value)
    .min(0, 'Grade cannot be negative'),
  occupation: Yup.string().trim(),
  siblingsGender: Yup.mixed<Gender>()
    .oneOf(Object.values(Gender), 'Please select a valid gender')
    .required('Gender is required'),
  maritalStatus: Yup.mixed<MaritalStatus>()
    .oneOf(Object.values(MaritalStatus), 'Please select a valid status')
    .required('Marital status is required'),
});

// Basic Information Schema (Complete Validation)
export const basicInformationSchema = Yup.object({
  physicalCondition: Yup.mixed<PhysicalCondition>().oneOf(Object.values(PhysicalCondition), 'Please select physical condition').required('Physical condition selection is required'),
  hasCriticalIllness: Yup.boolean().required('Please indicate if there is a critical illness'),
  typeOfIllness: Yup.string().when('hasCriticalIllness', {
    is: true,
    then: (schema) => schema.required('Please describe the type of illness'),
    otherwise: (schema) => schema,
  }),
  isResident: Yup.boolean().required('Please indicate if the child is a resident'),
  residenceStatus: Yup.mixed<ResidenceStatus>().oneOf(Object.values(ResidenceStatus), 'Please select a valid status').required('Residence status is required'),
  houseType: Yup.mixed<HouseType>().oneOf(Object.values(HouseType), 'Please select a valid type').required('House type is required'),
  bedroom: Yup.number().required('Number of bedrooms is required').min(0, 'Number of bedrooms cannot be negative'),
  balcony: Yup.boolean().required('Please indicate if there is a balcony'),
  kitchen: Yup.boolean().required('Please indicate if there is a kitchen'),
  store: Yup.boolean().required('Please indicate if there is a store'),
  hasTubeWell: Yup.boolean().required('Please indicate if there is a tube well'),
  toilet: Yup.boolean().required('Please indicate if there is a toilet'),
  guardiansName: Yup.string().required("Guardian's name is required").trim(),
  guardiansRelation: Yup.string().required("Guardian's relation is required").trim(),
  nid: Yup.string().required("Guardian's NID is required").trim(),
  NID: Yup.string()
    .test('nid-format', 'NID must be between 10-17 digits and properly formatted', function(value) {
      if (!value) return true; // Allow empty for optional fields

      // Remove all non-digit characters to check length
      const digitsOnly = value.replace(/\D/g, '');

      // Check length constraints
      if (digitsOnly.length < 10) {
        return this.createError({
          message: 'NID must be at least 10 digits'
        });
      }

      if (digitsOnly.length > 17) {
        return this.createError({
          message: 'NID cannot exceed 17 digits'
        });
      }

      // Validate format based on length
      if (digitsOnly.length === 10) {
        // Format should be: xxx-xxx-xxxx (3-3-4)
        const validFormat = /^\d{3}-\d{3}-\d{4}$/;
        if (!validFormat.test(value)) {
          return this.createError({
            message: 'NID with 10 digits must be formatted as xxx-xxx-xxxx'
          });
        }
      } else if (digitsOnly.length === 13) {
        // Format should be: xxxx-xxx-xxx-xxx (4-3-3-3) for 13 digits
        const validFormat = /^\d{4}-\d{3}-\d{3}-\d{3}$/;
        if (!validFormat.test(value)) {
          return this.createError({
            message: 'NID with 13 digits must be formatted as xxxx-xxx-xxx-xxx'
          });
        }
      } else {
        // Format should be: xxxx-xx-x-xx-xx-xxxxxx (4-2-1-2-2-6) for 11-12 and 14-17 digits
        const validFormat = /^\d{4}-\d{2}-\d{1}-\d{2}-\d{2}-\d{1,6}$/;
        if (!validFormat.test(value)) {
          return this.createError({
            message: 'NID must be properly formatted'
          });
        }
      }

      return true;
    }),
  cell1: commonValidationSchemas.phoneNumber.required('Primary contact number is required'),
  cell2: commonValidationSchemas.phoneNumber,
});

// Complete Orphan Application Schema
export const orphanApplicationSchema = Yup.object({
  primaryInformation: primaryInformationSchema,
  address: addressSchema,
  familyMembers: Yup.array()
    .of(familyMemberSchema)
    .test(
      'validate-family-members',
      'Family members information must be complete when siblings are specified',
      function(value) {
        const numOfSiblings = this.parent.primaryInformation?.numOfSiblings;

        // If no siblings specified or 0, no validation needed
        if (numOfSiblings === undefined || numOfSiblings === null || numOfSiblings === 0) {
          return true;
        }

        // If siblings exist, must have matching number of family member entries
        if (!value || value.length !== numOfSiblings) {
          return this.createError({
            message: `Please add ${numOfSiblings} family member${numOfSiblings > 1 ? 's' : ''} to match the number of siblings specified`,
            path: 'familyMembers'
          });
        }

        // Each family member must have required fields filled
        for (let i = 0; i < value.length; i++) {
          const member = value[i];
          if (!member.name || !member.age || !member.siblingsGender || !member.maritalStatus) {
            return this.createError({
              message: `Family member ${i + 1} must have name, age, gender, and marital status filled`,
              path: `familyMembers[${i}]`
            });
          }
        }

        return true;
      }
    ),
  basicInformation: basicInformationSchema,
});

// User Creation Schema
export const userCreationSchema = Yup.object({
  username: commonValidationSchemas.requiredString,
  email: commonValidationSchemas.requiredEmail,
  password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  isEnabled: Yup.boolean(),
  groups: Yup.array().of(Yup.string()).min(1, 'At least one role must be selected'),
  cell: commonValidationSchemas.phoneNumber,
  address: commonValidationSchemas.optionalString,
  beneficiaryCreateRequest: Yup.object({
    bcRegistration: commonValidationSchemas.optionalString,
    accountTitle: commonValidationSchemas.optionalString,
    accountNumber: commonValidationSchemas.optionalString,
    bankTitle: commonValidationSchemas.optionalString,
    branch: commonValidationSchemas.optionalString,
    routingNumber: commonValidationSchemas.optionalString,
  }),
});

// Partial Validation Schema (For Saving Drafts/Incomplete Forms)
// Only validates the most critical mandatory fields
export const partialOrphanApplicationSchema = Yup.object({
  primaryInformation: Yup.object({
    fullName: Yup.string().required('Full name is required').trim(),
    dateOfBirth: Yup.date()
      .required('Date of birth is required')
      .max(new Date(), 'Date of birth cannot be in the future')
      .test('date-relationship', 'Date of birth must be within 10 months after date of death', function(dateOfBirth) {
        const { dateOfDeath } = this.parent;
        if (!dateOfBirth || !dateOfDeath) return true;

        const birthDate = new Date(dateOfBirth);
        const deathDate = new Date(dateOfDeath);
        const timeDifference = birthDate.getTime() - deathDate.getTime();

        // Only validate if dateOfBirth is AFTER dateOfDeath
        if (timeDifference > 0) {
          // Calculate 10 months in milliseconds (approximately 10 * 30 days)
          const tenMonthsMs = 10 * 30 * 24 * 60 * 60 * 1000;

          if (timeDifference > tenMonthsMs) {
            return this.createError({
              message: 'Date of birth must be within 10 months after date of death'
            });
          }
        }

        return true;
      }),
    bcRegistration: commonValidationSchemas.bcRegistration,
    age: Yup.number()
      .required('Age is required')
      .typeError('Age must be a number')
      .integer('Age must be a whole number')
      .min(5, 'Age must be at least 5 years for orphan eligibility')
      .max(11, 'Age must be 11 or under for orphan eligibility'),
    gender: Yup.mixed<Gender>().oneOf(Object.values(Gender), 'Please select a gender').required('Gender selection is required'),
    fathersName: Yup.string().required("Father's name is required").trim(),
    dateOfDeath: Yup.date()
      .required("Father's date of death is required")
      .max(new Date(), 'Date of death cannot be in the future'),
  }),
  address: Yup.object({
    permanentDistrict: Yup.string().required('Permanent district is required').trim(),
    permanentSubDistrict: Yup.string().required('Permanent sub-district is required').trim(),
  }),
  familyMembers: Yup.array()
    .of(familyMemberSchema)
    .test(
      'validate-family-members',
      'Family members information must be complete when siblings are specified',
      function(value) {
        const numOfSiblings = this.parent.primaryInformation?.numOfSiblings;

        // If no siblings specified or 0, no validation needed
        if (numOfSiblings === undefined || numOfSiblings === null || numOfSiblings === 0) {
          return true;
        }

        // If siblings exist, must have matching number of family member entries
        if (!value || value.length !== numOfSiblings) {
          return this.createError({
            message: `Please add ${numOfSiblings} family member${numOfSiblings > 1 ? 's' : ''} to match the number of siblings specified`,
            path: 'familyMembers'
          });
        }

        // Each family member must have required fields filled
        for (let i = 0; i < value.length; i++) {
          const member = value[i];
          if (!member.name || !member.age || !member.siblingsGender || !member.maritalStatus) {
            return this.createError({
              message: `Family member ${i + 1} must have name, age, gender, and marital status filled`,
              path: `familyMembers[${i}]`
            });
          }
        }

        return true;
      }
    ),
});