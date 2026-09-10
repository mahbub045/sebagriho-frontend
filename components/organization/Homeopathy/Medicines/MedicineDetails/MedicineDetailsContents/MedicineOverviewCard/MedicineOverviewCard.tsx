import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicineDetailsCardProps } from '@/types/Organization/Homeopathy/Medicines/MedicinesType';

const MedicineOverviewCard: React.FC<MedicineDetailsCardProps> = ({
  medicine,
}) => {
  const isAvailable = medicine.status === 'AVAILABLE';

  return (
    <Card>
      <CardHeader className='flex flex-row items-start justify-between gap-3'>
        <div>
          <CardTitle className='text-primary text-xl font-semibold'>
            {medicine.name}
          </CardTitle>
          <p className='text-muted-foreground text-sm'>
            Power: {medicine.power ?? '—'}
          </p>
        </div>

        <Badge variant={isAvailable ? 'default' : 'danger'}>
          {isAvailable ? 'Available' : 'Unavailable'}
        </Badge>
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
