import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Medicine } from '@/types/Organization/Homeopathy/Medicines/MedicinesType';
import { getCurrencySymbol } from '@/utils/constants';
import { formatDate } from '@/utils/formatters';

type Props = {
  medicine: Medicine;
};

const MedicineInventoryCard: React.FC<Props> = ({ medicine }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base font-semibold'>Inventory</CardTitle>
      </CardHeader>

      <CardContent className='flex flex-col gap-3'>
        <div className='flex items-center justify-between'>
          <p className='text-muted-foreground text-sm'>Total Quantity</p>
          <p className='text-sm font-medium'>{medicine.total_quantity}</p>
        </div>

        <div className='flex items-center justify-between'>
          <p className='text-muted-foreground text-sm'>Unit Price</p>
          {medicine.unit_price === null ? (
            <p className='text-sm font-medium'>—</p>
          ) : (
            <p className='text-sm font-medium'>
              {getCurrencySymbol()}
              {medicine.unit_price}
            </p>
          )}
        </div>

        <div className='flex items-center justify-between'>
          <p className='text-muted-foreground text-sm'>Expiration Date</p>
          <p className='text-sm font-medium'>
            {medicine.expiration_date
              ? formatDate(medicine.expiration_date)
              : '—'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicineInventoryCard;
