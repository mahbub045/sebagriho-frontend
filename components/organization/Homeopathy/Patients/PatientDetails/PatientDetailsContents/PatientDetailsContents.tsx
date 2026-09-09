'use client';
import { useGetpatientDetailsQuery } from '@/lib/services/endpoints/organization/Homeopathy/Patients/PatientsApi';
import { Stethoscope } from 'lucide-react';
import { useParams } from 'next/navigation';
import DeleteCard from './DeleteCard/DeleteCard';
import PatientCaseHistoryCard from './PatientCaseHistoryCard/PatientCaseHistoryCard';
import PatientContactCard from './PatientContactCard/PatientContactCard';
import PatientFilesCard from './PatientFilesCard/PatientFilesCard';
import PatientIdentityCard from './PatientIdentityCard/PatientIdentityCard';
import PatientMedicalInfoCard from './PatientMedicalInfoCard/PatientMedicalInfoCard';
import PatientPersonalInfoCard from './PatientPersonalInfoCard/PatientPersonalInfoCard';

const PatientDetailsContents: React.FC = () => {
  const params = useParams<{ patientuid: string }>();
  const patientuid = params.patientuid;

  const {
    data: patient,
    isLoading,
    isError,
  } = useGetpatientDetailsQuery(patientuid);

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className='bg-background h-48 animate-pulse rounded-xl'
          />
        ))}
      </div>
    );
  }

  if (isError || !patient) {
    return (
      <div className='border-danger mt-2 flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
        <Stethoscope className='text-danger/50 h-10 w-10' />
        <p className='mt-3 text-sm font-medium'>Failed to load patient</p>
        <p className='text-muted-foreground mt-1 max-w-xs text-sm'>
          Something went wrong while loading this patient&apos;s details.
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <PatientIdentityCard patient={patient} />

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <PatientPersonalInfoCard patient={patient} />
        <PatientContactCard patient={patient} />
        <PatientMedicalInfoCard patient={patient} />
      </div>

      <PatientCaseHistoryCard patient={patient} />
      <PatientFilesCard patient={patient} />
      <DeleteCard patientuid={patient.uid} patientName={patient.user.name} />
    </div>
  );
};

export default PatientDetailsContents;
