'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useCreateAppointmentMutation } from '@/lib/services/endpoints/organization/Homeopathy/Appointments/AppointmentsApi';
import { useGetMedicinesQuery } from '@/lib/services/endpoints/organization/Homeopathy/Medicines/MedicinesApi';
import { useGetPatientsQuery } from '@/lib/services/endpoints/organization/Homeopathy/Patients/PatientsApi';
import {
  AppointmentStatus,
  CreateAppointmentDialogProps,
  MedicineOption,
  SelectedMedicineDraft,
} from '@/types/Organization/Homeopathy/Appointments/AppointmentsType';
import { Patient } from '@/types/Organization/Homeopathy/Patients/PatientsType';
import { getInitials } from '@/utils/formatters';
import { Check, ChevronsUpDown, Pill, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const CreateAppointmentDialog: React.FC<CreateAppointmentDialogProps> = ({
  isOpen,
  onClose,
}) => {
  // Patient select state
  const [patientPopoverOpen, setPatientPopoverOpen] = useState(false);
  const [patientSearchInput, setPatientSearchInput] = useState('');
  const [searchPatient, setSearchPatient] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Medicine select state
  const [medicinePopoverOpen, setMedicinePopoverOpen] = useState(false);
  const [medicineSearchInput, setMedicineSearchInput] = useState('');
  const [searchMedicine, setSearchMedicine] = useState('');
  const [selectedMedicines, setSelectedMedicines] = useState<
    SelectedMedicineDraft[]
  >([]);

  // Form fields
  const [symptoms, setSymptoms] = useState('');
  const [treatmentEffectiveness, setTreatmentEffectiveness] = useState('');
  const [status, setStatus] = useState<AppointmentStatus>('ACTIVE');

  // Debounce patient search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchPatient(patientSearchInput.trim());
    }, 400);

    return () => clearTimeout(timeout);
  }, [patientSearchInput]);

  // Debounce medicine search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchMedicine(medicineSearchInput.trim());
    }, 400);

    return () => clearTimeout(timeout);
  }, [medicineSearchInput]);

  // RTK HOOKS
  const { data: patients, isLoading } = useGetPatientsQuery({
    ...(searchPatient ? { search: searchPatient } : {}),
  });

  const { data: medicines, isLoading: isLoadingMedicines } =
    useGetMedicinesQuery({
      ...(searchMedicine ? { search: searchMedicine } : {}),
    });

  const [createAppointment, { isLoading: isCreating }] =
    useCreateAppointmentMutation();

  const resetForm = () => {
    setSelectedPatient(null);
    setPatientSearchInput('');
    setSearchPatient('');
    setSelectedMedicines([]);
    setMedicineSearchInput('');
    setSearchMedicine('');
    setSymptoms('');
    setTreatmentEffectiveness('');
    setStatus('ACTIVE');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const toggleMedicine = (medicine: {
    uid: string;
    name: string;
    power?: string | null;
    manufacturer?: string | null;
  }) => {
    setSelectedMedicines((current) => {
      const exists = current.some((item) => item.uid === medicine.uid);

      if (exists) {
        return current.filter((item) => item.uid !== medicine.uid);
      }

      return [
        ...current,
        {
          uid: medicine.uid,
          name: medicine.name,
          power: medicine.power,
          manufacturer: medicine.manufacturer,
          dosage: '',
          frequency: '',
          duration: '',
          notes: '',
        },
      ];
    });
  };

  const removeMedicine = (uid: string) => {
    setSelectedMedicines((current) =>
      current.filter((item) => item.uid !== uid),
    );
  };

  const updateMedicineField = (
    uid: string,
    field: 'dosage' | 'frequency' | 'duration' | 'notes',
    value: string,
  ) => {
    setSelectedMedicines((current) =>
      current.map((item) =>
        item.uid === uid ? { ...item, [field]: value } : item,
      ),
    );
  };

  const isFormValid = Boolean(selectedPatient) && symptoms.trim().length > 0;

  const handleSubmit = async () => {
    if (!selectedPatient) return;

    try {
      await createAppointment({
        patient: selectedPatient.uid,
        symptoms: symptoms.trim(),
        treatment_effectiveness: treatmentEffectiveness.trim(),
        medicines: selectedMedicines.map((medicine) => ({
          medicine: medicine.uid,
          dosage: medicine.dosage || undefined,
          frequency: medicine.frequency || undefined,
          duration: medicine.duration || undefined,
          notes: medicine.notes || undefined,
        })),
      }).unwrap();
      toast.success('Appointment created successfully!');
      handleClose();
    } catch {
      // Surface via toast/notification system — swap in your existing error handler
      toast.error('Failed to create appointment. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className='max-h-[90vh] max-w-3xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Create Appointment</DialogTitle>

          <DialogDescription>
            Select a patient, add medicines, and record the visit details.
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-5 py-2'>
          {/* PATIENT SEARCH & SELECT */}
          <div className='flex flex-col gap-1.5'>
            <Label>Patient</Label>

            <Popover
              open={patientPopoverOpen}
              onOpenChange={setPatientPopoverOpen}
            >
              <PopoverTrigger>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={patientPopoverOpen}
                  className='w-full justify-between font-normal'
                >
                  {selectedPatient ? (
                    <span className='flex items-center gap-2'>
                      <Avatar className='h-5 w-5'>
                        <AvatarFallback className='bg-primary/5 text-primary text-[10px] font-semibold'>
                          {getInitials(selectedPatient.user?.name)}
                        </AvatarFallback>
                      </Avatar>

                      {selectedPatient.user?.name}
                    </span>
                  ) : (
                    <span className='text-muted-foreground'>
                      Search patient by name, serial number...
                    </span>
                  )}

                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>

              <PopoverContent className='w-full p-0' align='start'>
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder='Search patients...'
                    value={patientSearchInput}
                    onValueChange={setPatientSearchInput}
                    className='m-1! h-6! focus:ring-0!'
                  />

                  <CommandList className='max-h-70 overflow-y-auto'>
                    {isLoading && (
                      <div className='text-muted-foreground p-4 text-center text-sm'>
                        Searching...
                      </div>
                    )}

                    {!isLoading && (
                      <CommandEmpty>No patients found.</CommandEmpty>
                    )}

                    <CommandGroup>
                      {patients?.results?.map((patient: Patient) => (
                        <CommandItem
                          key={patient.uid}
                          value={patient.uid}
                          onSelect={() => {
                            setSelectedPatient(patient);
                            setPatientPopoverOpen(false);
                          }}
                          className='flex items-center gap-2'
                        >
                          <Avatar className='h-7 w-7'>
                            <AvatarFallback className='bg-primary/5 text-primary text-xs font-semibold'>
                              {getInitials(patient.user?.name)}
                            </AvatarFallback>
                          </Avatar>

                          <div className='min-w-0 flex-1'>
                            <p className='truncate text-sm font-medium'>
                              {patient.user?.name}
                            </p>

                            <p className='text-muted-foreground truncate text-xs'>
                              #{patient.serial_number}
                            </p>
                          </div>

                          <Check
                            className={`h-4 w-4 shrink-0 ${
                              selectedPatient?.uid === patient.uid
                                ? 'opacity-100'
                                : 'opacity-0'
                            }`}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* MEDICINE SEARCH & MULTI-SELECT */}
          <div className='flex flex-col gap-1.5'>
            <Label>Medicines</Label>

            <Popover
              open={medicinePopoverOpen}
              onOpenChange={setMedicinePopoverOpen}
            >
              <PopoverTrigger>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={medicinePopoverOpen}
                  className='w-full justify-between font-normal'
                >
                  <span className='text-muted-foreground flex items-center gap-2'>
                    <Pill className='h-4 w-4' />
                    {selectedMedicines.length > 0
                      ? `${selectedMedicines.length} medicine${
                          selectedMedicines.length > 1 ? 's' : ''
                        } selected`
                      : 'Search and add medicines...'}
                  </span>

                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className='w-[--radix-popover-trigger-width] p-0'
                align='start'
              >
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder='Search medicines...'
                    value={medicineSearchInput}
                    onValueChange={setMedicineSearchInput}
                    className='m-1! h-6! focus:ring-0!'
                  />

                  <CommandList className='max-h-70 overflow-y-auto'>
                    {isLoadingMedicines && (
                      <div className='text-muted-foreground p-4 text-center text-sm'>
                        Searching...
                      </div>
                    )}

                    {!isLoadingMedicines && (
                      <CommandEmpty>No medicines found.</CommandEmpty>
                    )}

                    <CommandGroup>
                      {medicines?.results?.map((medicine: MedicineOption) => {
                        const isSelected = selectedMedicines.some(
                          (item) => item.uid === medicine.uid,
                        );

                        return (
                          <CommandItem
                            key={medicine.uid}
                            value={medicine.uid}
                            onSelect={() => toggleMedicine(medicine)}
                            className='flex items-center gap-2'
                          >
                            <div className='min-w-0 flex-1'>
                              <p className='truncate text-sm font-medium'>
                                {medicine.name}{' '}
                                {medicine.power && (
                                  <span className='text-muted-foreground text-xs'>
                                    {medicine.power}
                                  </span>
                                )}
                              </p>

                              {medicine.manufacturer && (
                                <p className='text-muted-foreground truncate text-xs'>
                                  {medicine.manufacturer}
                                </p>
                              )}
                            </div>

                            <Check
                              className={`h-4 w-4 shrink-0 ${
                                isSelected ? 'opacity-100' : 'opacity-0'
                              }`}
                            />
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Selected medicines list with per-item prescription fields */}
            {selectedMedicines.length > 0 && (
              <div className='mt-1 flex max-h-80 flex-col gap-2 overflow-y-auto pr-1'>
                {selectedMedicines.map((medicine) => (
                  <div
                    key={medicine.uid}
                    className='border-primary/60 flex flex-col gap-2 rounded-lg border p-3'
                  >
                    <div className='flex items-center justify-between gap-2'>
                      <Badge variant='outline' className='font-medium'>
                        {medicine.name}
                        {medicine.power ? ` • ${medicine.power}` : ''}
                      </Badge>

                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='text-muted-foreground hover:text-danger h-6 w-6'
                        onClick={() => removeMedicine(medicine.uid)}
                      >
                        <Trash2 className='h-3.5 w-3.5' />
                      </Button>
                    </div>

                    <div className='grid grid-cols-2 gap-2'>
                      <Input
                        type='text'
                        placeholder='Dosage'
                        value={medicine.dosage}
                        onChange={(event) =>
                          updateMedicineField(
                            medicine.uid,
                            'dosage',
                            event.target.value,
                          )
                        }
                      />

                      <Input
                        type='text'
                        placeholder='Frequency'
                        value={medicine.frequency}
                        onChange={(event) =>
                          updateMedicineField(
                            medicine.uid,
                            'frequency',
                            event.target.value,
                          )
                        }
                      />
                    </div>

                    <Input
                      type='text'
                      placeholder='Duration (e.g. 7 days)'
                      value={medicine.duration}
                      onChange={(event) =>
                        updateMedicineField(
                          medicine.uid,
                          'duration',
                          event.target.value,
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SYMPTOMS */}
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='symptoms'>Symptoms</Label>

            <Textarea
              id='symptoms'
              placeholder='Describe the symptoms...'
              value={symptoms}
              onChange={(event) => setSymptoms(event.target.value)}
              rows={3}
            />
          </div>

          {/* TREATMENT EFFECTIVENESS */}
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='treatment_effectiveness'>
              Treatment Effectiveness
            </Label>

            <Textarea
              id='treatment_effectiveness'
              placeholder='Notes on how prior treatment is working...'
              value={treatmentEffectiveness}
              onChange={(event) =>
                setTreatmentEffectiveness(event.target.value)
              }
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose} disabled={isCreating}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={!isFormValid || isCreating}>
            {isCreating ? 'Creating...' : 'Create Appointment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAppointmentDialog;
