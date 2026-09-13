'use client';

import Loading from '@/components/common/CustomLoader/Loading';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MEAL_TIMING_OPTIONS } from '@/data/common/ChoiceFields';
import { useEditAppointmentMutation } from '@/lib/services/endpoints/organization/Homeopathy/Appointments/AppointmentsApi';
import { useGetMedicinesQuery } from '@/lib/services/endpoints/organization/Homeopathy/Medicines/MedicinesApi';
import { MedicineOption } from '@/types/Organization/Homeopathy/Appointments/AppointmentsType';
import { Check, ChevronsUpDown, Pill, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AddNewMedicineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentUid: string;
}

interface SelectedMedicineDraft {
  uid: string;
  name: string;
  power?: string;
  dosage: string;
  frequency: string;
  duration: string;
  meal_timing: string;
  instructions: string;
}

const AddNewMedicineDialog: React.FC<AddNewMedicineDialogProps> = ({
  isOpen,
  onClose,
  appointmentUid,
}) => {
  const [medicinePopoverOpen, setMedicinePopoverOpen] = useState(false);
  const [medicineSearchInput, setMedicineSearchInput] = useState('');
  const [selectedMedicines, setSelectedMedicines] = useState<
    SelectedMedicineDraft[]
  >([]);
  // Reset the form once per "open" transition (same pattern as EditPrescriptionDialog).
  const [hasSynced, setHasSynced] = useState(false);
  if (isOpen && !hasSynced) {
    setHasSynced(true);
  } else if (!isOpen && hasSynced) {
    setHasSynced(false);
    setSelectedMedicines([]);
    setMedicineSearchInput('');
    setMedicinePopoverOpen(false);
  }

  const { data: medicines, isLoading: isLoadingMedicines } =
    useGetMedicinesQuery({
      ...(medicineSearchInput ? { search: medicineSearchInput } : {}),
      appointment_uid: appointmentUid,
    });

  const [editAppointment, { isLoading }] = useEditAppointmentMutation();

  const toggleMedicine = (medicine: MedicineOption) => {
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
          power: medicine.power ?? undefined,
          dosage: '',
          frequency: '',
          duration: '',
          meal_timing: '',
          instructions: '',
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
    field: keyof Omit<SelectedMedicineDraft, 'uid' | 'name' | 'power'>,
    value: string,
  ) => {
    setSelectedMedicines((current) =>
      current.map((item) =>
        item.uid === uid ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (selectedMedicines.length === 0) {
      toast.error('Select at least one medicine to add.');
      return;
    }

    try {
      await editAppointment({
        appointmentUid,
        appointmentData: {
          appointment_prescription: selectedMedicines.map((medicine) => ({
            medicine: medicine.uid,
            dosage: medicine.dosage || undefined,
            frequency: medicine.frequency || undefined,
            duration: medicine.duration ? Number(medicine.duration) : undefined,
            meal_timing: medicine.meal_timing || undefined,
            instructions: medicine.instructions || undefined,
          })),
        },
      }).unwrap();

      toast.success('Medicine(s) added successfully!');
      handleClose();
    } catch {
      toast.error('Failed to add medicine(s). Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-primary text-lg font-semibold'>
            Add Medicine
          </DialogTitle>

          <DialogDescription>
            Search and select medicines to add to this prescription.
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-1.5 py-2'>
          <Label>Medicines</Label>

          <Popover
            open={medicinePopoverOpen}
            onOpenChange={setMedicinePopoverOpen}
          >
            <PopoverTrigger
              render={
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={medicinePopoverOpen}
                  className='w-full justify-between font-normal'
                />
              }
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

          {selectedMedicines.length > 0 && (
            <div className='mt-1 flex max-h-96 flex-col gap-2 overflow-y-auto pr-1'>
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

                  <div className='grid grid-cols-2 gap-2'>
                    <Input
                      type='number'
                      min={0}
                      placeholder='Duration (days)'
                      value={medicine.duration}
                      onChange={(event) =>
                        updateMedicineField(
                          medicine.uid,
                          'duration',
                          event.target.value,
                        )
                      }
                    />

                    <Select
                      items={MEAL_TIMING_OPTIONS}
                      value={medicine.meal_timing}
                      onValueChange={(value) =>
                        updateMedicineField(
                          medicine.uid,
                          'meal_timing',
                          value || '',
                        )
                      }
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Meal timing' />
                      </SelectTrigger>

                      <SelectContent>
                        {MEAL_TIMING_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Input
                    type='text'
                    placeholder='Instructions (e.g. Take with water)'
                    value={medicine.instructions}
                    onChange={(event) =>
                      updateMedicineField(
                        medicine.uid,
                        'instructions',
                        event.target.value,
                      )
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <Loading className='text-white!' /> : ''}
            Add Medicine{selectedMedicines.length > 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewMedicineDialog;
