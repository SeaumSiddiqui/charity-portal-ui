export const formatPhoneNumber = (value: string): string => {
  const digitsOnly = value.replace(/[^\d]/g, '');

  let numbers = digitsOnly;
  if (!numbers.startsWith('880')) {
    numbers = '880' + numbers.replace(/^0+/, '');
  }

  const localNumber = numbers.slice(3);

  if (localNumber.length > 11) {
    numbers = '880' + localNumber.slice(0, 11);
  }

  const prefix = '+880';
  const formatted = numbers.slice(3);

  if (formatted.length <= 2) {
    return prefix + formatted;
  } else if (formatted.length <= 6) {
    return `${prefix}${formatted.slice(0, 2)}-${formatted.slice(2)}`;
  } else if (formatted.length <= 10) {
    return `${prefix}${formatted.slice(0, 2)}-${formatted.slice(2, 6)}-${formatted.slice(6)}`;
  } else {
    return `${prefix}${formatted.slice(0, 2)}-${formatted.slice(2, 6)}-${formatted.slice(6, 10)}`;
  }
};

export const normalizePhoneInput = (value: string): string => {
  if (!value.startsWith('+880')) {
    return '+880' + value.replace(/^\+880/, '');
  }
  return value;
};

export const PHONE_PREFIX = '+880';
