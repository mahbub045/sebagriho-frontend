'use client';

import { Card } from '@/components/ui/card';
import { useGetAppointmentDetailsQuery } from '@/lib/services/endpoints/organization/Homeopathy/Appointments/AppointmentsApi';
import { AlertTriangle } from 'lucide-react';
import { useParams } from 'next/navigation';
import AppointmentInfoCard from './AppointmentInfoCard/AppointmentInfoCard';
import FilesCard from './FilesCard/FilesCard';
import MedicinesCard from './MedicinesCard/MedicinesCard';
import PatientInfoCard from './PatientInfoCard/PatientInfoCard';

const AppointmentDetailsContent: React.FC = () => {
  const { appointmentuid } = useParams<{ appointmentuid: string }>();

  const {
    data: appointment,
    isLoading,
    error,
  } = useGetAppointmentDetailsQuery({ appointmentUid: appointmentuid });

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <div className='bg-background h-96 animate-pulse rounded-xl lg:col-span-1' />

        <div className='flex flex-col gap-4 lg:col-span-2'>
          <div className='bg-background h-48 animate-pulse rounded-xl' />
          <div className='bg-background h-40 animate-pulse rounded-xl' />
          <div className='bg-background h-40 animate-pulse rounded-xl' />
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <Card className='border-danger/40 flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
        <AlertTriangle className='text-danger/50 h-10 w-10' />

        <p className='mt-3 text-sm font-medium'>Failed to load appointment</p>

        <p className='text-muted-foreground mt-1 max-w-xs text-sm'>
          Something went wrong while loading this appointment&apos;s details.
        </p>
      </Card>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h1 className='text-xl font-semibold tracking-tight'>
          Appointment Details
        </h1>

        <p className='text-muted-foreground mt-1 text-sm'>
          Full record for this patient appointment.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        {/* Left column — patient */}
        <div className='lg:col-span-1'>
          <PatientInfoCard patient={appointment.patient} />
        </div>

        {/* Right column — appointment, medicines, files */}
        <div className='flex flex-col gap-4 lg:col-span-2'>
          <AppointmentInfoCard appointment={appointment} />

          <MedicinesCard medicines={appointment.medicines} />
        </div>
      </div>
      <div>
        <FilesCard files={appointment.files} />
      </div>
    </div>
  );
};

export default AppointmentDetailsContent;
