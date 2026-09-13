'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAppointmentDetailsQuery } from '@/lib/services/endpoints/organization/Homeopathy/Appointments/AppointmentsApi';
import { AlertTriangle } from 'lucide-react';
import { useParams } from 'next/navigation';
import AppointmentInfoCard from './AppointmentInfoCard/AppointmentInfoCard';
import DeleteCard from './DeleteCard/DeleteCard';
import FilesCard from './FilesCard/FilesCard';
import PatientInfoCard from './PatientInfoCard/PatientInfoCard';
import PrescriptionCard from './PrescriptionCard/PrescriptionCard';

const AppointmentDetailsContent: React.FC = () => {
  const { appointmentuid } = useParams<{ appointmentuid: string }>();

  const {
    data: appointment,
    isLoading,
    error,
  } = useGetAppointmentDetailsQuery({ appointmentUid: appointmentuid });

  if (isLoading) {
    return (
      <div className='flex flex-col gap-4'>
        {/* Header */}
        <div>
          <Skeleton className='h-6 w-48' />
          <Skeleton className='mt-2 h-4 w-64' />
        </div>

        <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
          {/* Patient card skeleton */}
          <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm lg:col-span-1'>
            <div className='border-border/60 flex flex-col items-center gap-3 border-b p-6'>
              <Skeleton className='h-20 w-20 rounded-full' />
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-3 w-24' />
            </div>

            <div className='flex flex-col gap-4 p-4'>
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <Skeleton className='h-3.5 w-3.5 shrink-0 rounded-full' />

                  <div className='flex-1 space-y-1.5'>
                    <Skeleton className='h-2.5 w-20' />
                    <Skeleton className='h-3.5 w-28' />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Right column */}
          <div className='flex flex-col gap-4 lg:col-span-2'>
            {/* Appointment overview skeleton */}
            <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
              <div className='border-border/60 flex items-center justify-between border-b p-4'>
                <Skeleton className='h-4 w-40' />
                <Skeleton className='h-5 w-16 rounded-full' />
              </div>

              <div className='flex flex-col gap-4 p-4'>
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className='flex items-start gap-3'>
                    <Skeleton className='mt-0.5 h-4 w-4 shrink-0 rounded-full' />

                    <div className='flex-1 space-y-1.5'>
                      <Skeleton className='h-2.5 w-28' />
                      <Skeleton className='h-4 w-full max-w-sm' />
                    </div>
                  </div>
                ))}
              </div>

              <div className='border-border/60 bg-muted/30 flex items-center justify-between border-t px-4 py-3'>
                <div className='space-y-1.5'>
                  <Skeleton className='h-2.5 w-14' />
                  <Skeleton className='h-3 w-24' />
                </div>

                <div className='space-y-1.5 text-right'>
                  <Skeleton className='ml-auto h-2.5 w-20' />
                  <Skeleton className='ml-auto h-3 w-24' />
                </div>
              </div>
            </Card>

            {/* Medicines skeleton */}
            <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
              <div className='border-border/60 flex items-center gap-2 border-b p-4'>
                <Skeleton className='h-4 w-4 rounded-full' />
                <Skeleton className='h-4 w-24' />
              </div>

              <div className='flex flex-col items-center justify-center gap-2 px-4 py-10'>
                <Skeleton className='h-7 w-7 rounded-full' />
                <Skeleton className='h-3 w-40' />
              </div>
            </Card>

            {/* Files skeleton */}
            <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
              <div className='border-border/60 flex items-center gap-2 border-b p-4'>
                <Skeleton className='h-4 w-4 rounded-full' />
                <Skeleton className='h-4 w-16' />
              </div>

              <div className='flex flex-col items-center justify-center gap-2 px-4 py-10'>
                <Skeleton className='h-7 w-7 rounded-full' />
                <Skeleton className='h-3 w-48' />
              </div>
            </Card>
          </div>
        </div>

        {/* Danger zone skeleton */}
        <div className='border-danger/30 bg-danger/5 flex items-center justify-between gap-4 rounded-xl border p-4'>
          <div className='flex items-center gap-3'>
            <Skeleton className='h-4 w-4 rounded-full' />
            <Skeleton className='h-3.5 w-72' />
          </div>

          <Skeleton className='h-9 w-36 rounded-md' />
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
          <PrescriptionCard
            appointment_prescription={appointment.appointment_prescription}
          />
        </div>
      </div>
      <div>
        <FilesCard files={appointment.files} />
        <DeleteCard appointment={appointment} />
      </div>
    </div>
  );
};

export default AppointmentDetailsContent;
