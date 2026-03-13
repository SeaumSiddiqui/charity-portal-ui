import React from 'react';
import { FormikProps } from 'formik';
import { OrphanApplication, UserProfile } from '../../types';
import { PersonalDetailsSection } from './sections/PersonalDetailsSection';
import { ParentsInfoSection } from './sections/ParentsInfoSection';
import { FinancialFamilySection } from './sections/FinancialFamilySection';
import { EducationSection } from './sections/EducationSection';

interface PrimaryInformationFormikProps {
  formik: FormikProps<OrphanApplication>;
  userProfile?: UserProfile | null;
  isEditing?: boolean;
}

export const PrimaryInformationFormik: React.FC<PrimaryInformationFormikProps> = ({
  formik,
  userProfile,
  isEditing = false
}) => {
  return (
    <div className="space-y-6">
      <PersonalDetailsSection
        formik={formik}
        userProfile={userProfile}
        isEditing={isEditing}
      />
      <ParentsInfoSection formik={formik} />
      <FinancialFamilySection formik={formik} />
      <EducationSection formik={formik} />
    </div>
  );
};
