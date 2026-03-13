export const formatNID = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, '');
  const limitedDigits = digitsOnly.slice(0, 17);

  if (limitedDigits.length === 0) {
    return '';
  } else if (limitedDigits.length <= 10) {
    if (limitedDigits.length <= 3) {
      return limitedDigits;
    } else if (limitedDigits.length <= 6) {
      return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3)}`;
    } else {
      return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6)}`;
    }
  } else if (limitedDigits.length === 13) {
    if (limitedDigits.length <= 4) {
      return limitedDigits;
    } else if (limitedDigits.length <= 7) {
      return `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4)}`;
    } else if (limitedDigits.length <= 10) {
      return `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4, 7)}-${limitedDigits.slice(7)}`;
    } else {
      return `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4, 7)}-${limitedDigits.slice(7, 10)}-${limitedDigits.slice(10)}`;
    }
  } else {
    if (limitedDigits.length <= 4) {
      return limitedDigits;
    } else if (limitedDigits.length <= 6) {
      return `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4)}`;
    } else if (limitedDigits.length <= 7) {
      return `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4, 6)}-${limitedDigits.slice(6)}`;
    } else if (limitedDigits.length <= 9) {
      return `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4, 6)}-${limitedDigits.slice(6, 7)}-${limitedDigits.slice(7)}`;
    } else if (limitedDigits.length <= 11) {
      return `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4, 6)}-${limitedDigits.slice(6, 7)}-${limitedDigits.slice(7, 9)}-${limitedDigits.slice(9)}`;
    } else {
      return `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4, 6)}-${limitedDigits.slice(6, 7)}-${limitedDigits.slice(7, 9)}-${limitedDigits.slice(9, 11)}-${limitedDigits.slice(11)}`;
    }
  }
};

export const stripNIDFormatting = (value: string): string => {
  return value.replace(/\D/g, '');
};
