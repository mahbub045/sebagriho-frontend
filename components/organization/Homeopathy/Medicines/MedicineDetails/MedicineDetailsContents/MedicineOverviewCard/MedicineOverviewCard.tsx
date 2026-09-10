import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicineDetailsCardProps } from '@/types/Organization/Homeopathy/Medicines/MedicinesType';
import { Edit } from 'lucide-react';

const MedicineOverviewCard: React.FC<MedicineDetailsCardProps> = ({
  medicine,
}) => {
  const isAvailable = medicine.status === 'AVAILABLE';

  return (
    <Card>
      <CardHeader className='flex flex-row items-start justify-between gap-3'>
        <div>
          <CardTitle className='text-primary flex items-center gap-2 text-xl font-semibold'>
            <span>{medicine.name}</span>
            <Badge variant={isAvailable ? 'success' : 'danger'}>
              {isAvailable ? 'Available' : 'Unavailable'}
            </Badge>
          </CardTitle>
          <p className='text-muted-foreground text-sm'>
            Power: {medicine.power ?? '—'}
          </p>
        </div>

        <Button variant='default' size='sm'>
          <Edit />
          Edit
        </Button>
      </CardHeader>

      <CardContent className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <div>
          <p className='text-muted-foreground text-xs'>Manufacturer</p>
          <p className='text-sm font-medium'>{medicine.manufacturer || '—'}</p>
        </div>
        <div>
          <p className='text-muted-foreground text-xs'>Batch Number</p>
          <p className='text-sm font-medium'>{medicine.batch_number || '—'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicineOverviewCard;
