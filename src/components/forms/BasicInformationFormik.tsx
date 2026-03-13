import React from 'react';
import { FormikProps } from 'formik';
import { OrphanApplication } from '../../types';
import { PhysicalHealthSection } from './sections/PhysicalHealthSection';
import { ResidenceSection } from './sections/ResidenceSection';
import { HouseholdSection } from './sections/HouseholdSection';
import { GuardianSection } from './sections/GuardianSection';

interface BasicInformationFormikProps {
  formik: FormikProps<OrphanApplication>;
}

export const BasicInformationFormik: React.FC<BasicInformationFormikProps> = ({ formik }) => {
  return (
    <div className="space-y-6">
      <PhysicalHealthSection formik={formik} />
      <ResidenceSection formik={formik} />
      <HouseholdSection formik={formik} />
      <GuardianSection formik={formik} />
    </div>
  );
};
