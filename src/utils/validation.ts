import { ValidationError } from '../types';

export const validateRequired = (value: any, fieldName: string, tabName?: string): ValidationError | null => {
  if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
      tab: tabName
    };
  }
  return null;
};

export const validateEmail = (email: string, fieldName: string, tabName?: string): ValidationError | null => {
  if (!email) return null; // Optional field
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      field: fieldName,
      message: `${fieldName} must be a valid email address`,
      tab: tabName
    };
  }
  return null;
};

export const validatePhone = (phone: string, fieldName: string, tabName?: string): ValidationError | null => {
  if (!phone) return null; // Optional field
  
  const phoneRegex = /^[\+]?[0-9\-\(\)\s]+$/;
  if (!phoneRegex.test(phone) || phone.length < 10) {
    return {
      field: fieldName,
      message: `${fieldName} must be a valid phone number`,
      tab: tabName
    };
  }
  return null;
};

export const validateAge = (age: number, fieldName: string, min: number = 0, max: number = 150, tabName?: string): ValidationError | null => {
  if (age === null || age === undefined) {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
      tab: tabName
    };
  }
  
  if (age < min || age > max) {
    return {
      field: fieldName,
      message: `${fieldName} must be between ${min} and ${max}`,
      tab: tabName
    };
  }
  return null;
};

export const validatePositiveNumber = (value: number, fieldName: string, tabName?: string): ValidationError | null => {
  if (value === null || value === undefined) {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
      tab: tabName
    };
  }
  
  if (value < 0) {
    return {
      field: fieldName,
      message: `${fieldName} must be a positive number`,
      tab: tabName
    };
  }
  return null;
};

export const validateDate = (date: string, fieldName: string, tabName?: string): ValidationError | null => {
  if (!date) {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
      tab: tabName
    };
  }
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return {
      field: fieldName,
      message: `${fieldName} must be a valid date`,
      tab: tabName
    };
  }
  
  // Check if date is not in the future (for birth dates, death dates, etc.)
  if (dateObj > new Date()) {
    return {
      field: fieldName,
      message: `${fieldName} cannot be in the future`,
      tab: tabName
    };
  }
  
  return null;
};

export const validatePostalCode = (code: string, fieldName: string, tabName?: string): ValidationError | null => {
  if (!code) {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
      tab: tabName
    };
  }
  
  // Bangladesh postal code format (4 digits)
  const postalRegex = /^\d{4}$/;
  if (!postalRegex.test(code)) {
    return {
      field: fieldName,
      message: `${fieldName} must be a 4-digit postal code`,
      tab: tabName
    };
  }
  return null;
};

export const scrollToError = (path: string) => {
  // Try multiple strategies to find the error field
  let errorElement: Element | null = null;

  // Special handling for familyMembers array errors
  if (path === 'familyMembers' || path.startsWith('familyMembers[')) {
    // If error is on the array itself, scroll to the first family member field
    if (path === 'familyMembers') {
      errorElement = document.querySelector('[name="familyMembers.0.name"]');
    } else {
      // Extract index from path like "familyMembers[0]" or "familyMembers[0].name"
      const match = path.match(/familyMembers\[(\d+)\](?:\.(.+))?/);
      if (match) {
        const index = match[1];
        const field = match[2] || 'name'; // Default to name field if no specific field
        errorElement = document.querySelector(`[name="familyMembers.${index}.${field}"]`);
      }
    }
  }

  // Strategy 1: Find by exact name attribute match
  if (!errorElement) {
    errorElement = document.querySelector(`[name="${path}"]`);
  }

  // Strategy 2: Try with ID (some fields might use ID instead of name)
  if (!errorElement) {
    const fieldId = path.replace(/\./g, '-').toLowerCase();
    errorElement = document.getElementById(fieldId);
  }

  // Strategy 3: Try to find any input within a container with data-field attribute
  if (!errorElement) {
    const container = document.querySelector(`[data-field="${path}"]`);
    if (container) {
      errorElement = container.querySelector('input, select, textarea, button');
    }
  }

  // Strategy 4: For nested paths like "primaryInformation.age", try direct match
  if (!errorElement && path.includes('.')) {
    errorElement = document.querySelector(`[name="${path}"]`);
  }

  // Strategy 5: Try partial match on name attribute (last resort)
  if (!errorElement) {
    const fieldName = path.split('.').pop(); // Get last part of path
    errorElement = document.querySelector(`[name*="${fieldName}"]`);
  }

  if (errorElement) {
    // First, scroll the element into view
    errorElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    });

    // Wait a bit for scroll to complete, then focus and highlight
    setTimeout(() => {
      // Try to focus the element
      if (errorElement instanceof HTMLElement) {
        errorElement.focus({ preventScroll: true });
      }

      // Add visual highlight
      errorElement.classList.add('error-highlight');

      // Pulse effect for better visibility
      errorElement.animate([
        { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' },
        { boxShadow: '0 0 0 8px rgba(239, 68, 68, 0)' },
      ], {
        duration: 1000,
        iterations: 2
      });

      // Remove highlight class after animation
      setTimeout(() => {
        errorElement?.classList.remove('error-highlight');
      }, 2000);
    }, 300);

    return true;
  } else {
    console.warn(`Could not find error field for path: ${path}`);
    return false;
  }
};

export const groupErrorsByTab = (errors: ValidationError[]): Record<string, ValidationError[]> => {
  return errors.reduce((acc, error) => {
    const tab = error.tab || 'general';
    if (!acc[tab]) {
      acc[tab] = [];
    }
    acc[tab].push(error);
    return acc;
  }, {} as Record<string, ValidationError[]>);
};

// Full validation for all required fields
export const validateApplicationFull = (application: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Primary Information - all required fields
  if (!application.primaryInformation?.fullName?.trim()) {
    errors.push({ field: 'fullName', message: 'Full name is required', tab: 'Primary Information' });
  }
  if (!application.primaryInformation?.dateOfBirth) {
    errors.push({ field: 'dateOfBirth', message: 'Date of birth is required', tab: 'Primary Information' });
  }
  if (!application.primaryInformation?.bcRegistration?.trim()) {
    errors.push({ field: 'bcRegistration', message: 'BC registration is required', tab: 'Primary Information' });
  }
  if (!application.primaryInformation?.gender) {
    errors.push({ field: 'gender', message: 'Gender is required', tab: 'Primary Information' });
  }
  if (!application.primaryInformation?.fathersName?.trim()) {
    errors.push({ field: 'fathersName', message: 'Father\'s name is required', tab: 'Primary Information' });
  }
  if (!application.primaryInformation?.dateOfDeath) {
    errors.push({ field: 'dateOfDeath', message: 'Father\'s date of death is required', tab: 'Primary Information' });
  }
  if (application.primaryInformation?.age === undefined || application.primaryInformation?.age < 0 || application.primaryInformation?.age > 18) {
    errors.push({ field: 'age', message: 'Valid age between 0 and 18 is required', tab: 'Primary Information' });
  }
  if (application.primaryInformation?.grade === undefined || application.primaryInformation?.grade < 0) {
    errors.push({ field: 'grade', message: 'Grade is required', tab: 'Primary Information' });
  }

  // Address - required fields
  if (!application.address?.permanentDistrict?.trim()) {
    errors.push({ field: 'permanentDistrict', message: 'Permanent district is required', tab: 'Address' });
  }
  if (!application.address?.permanentSubDistrict?.trim()) {
    errors.push({ field: 'permanentSubDistrict', message: 'Permanent sub-district is required', tab: 'Address' });
  }
  if (!application.address?.isSameAsPermanent) {
    if (!application.address?.presentDistrict?.trim()) {
      errors.push({ field: 'presentDistrict', message: 'Present district is required', tab: 'Address' });
    }
    if (!application.address?.presentSubDistrict?.trim()) {
      errors.push({ field: 'presentSubDistrict', message: 'Present sub-district is required', tab: 'Address' });
    }
  }

  // Basic Information - required fields
  if (!application.basicInformation?.physicalCondition) {
    errors.push({ field: 'physicalCondition', message: 'Physical condition is required', tab: 'Basic Information' });
  }
  if (!application.basicInformation?.guardiansName?.trim()) {
    errors.push({ field: 'guardiansName', message: 'Guardian\'s name is required', tab: 'Basic Information' });
  }
  if (!application.basicInformation?.cell1?.trim()) {
    errors.push({ field: 'cell1', message: 'Contact number is required', tab: 'Basic Information' });
  }

  return errors;
};

// Partial validation for key fields only
export const validateApplicationPartial = (application: any): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Only check most critical fields for partial validation
  if (!application.primaryInformation?.fullName?.trim()) {
    errors.push({ field: 'fullName', message: 'Full name is required', tab: 'Primary Information' });
  }
  if (!application.primaryInformation?.fathersName?.trim()) {
    errors.push({ field: 'fathersName', message: 'Father\'s name is required', tab: 'Primary Information' });
  }
  if (!application.primaryInformation?.bcRegistration?.trim()) {
    errors.push({ field: 'bcRegistration', message: 'BC registration is required', tab: 'Primary Information' });
  }
  
  return errors;
};