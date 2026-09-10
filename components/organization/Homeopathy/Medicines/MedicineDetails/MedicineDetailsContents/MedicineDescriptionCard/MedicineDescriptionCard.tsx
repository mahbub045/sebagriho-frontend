import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicineDetailsCardProps } from '@/types/Organization/Homeopathy/Medicines/MedicinesType';
import { Edit } from 'lucide-react';

const MedicineDescriptionCard: React.FC<MedicineDetailsCardProps> = ({
  medicine,
}) => {
  return (
    <Card>
      <CardHeader className='flex items-center justify-between'>
        <CardTitle className='text-base font-semibold'>Description</CardTitle>
        <Button variant='default' size='sm'>
          <Edit />
          Edit
        </Button>
      </CardHeader>

      <CardContent>
        <p className='text-muted-foreground text-sm whitespace-pre-line'>
          {medicine.description || 'No description provided.'}
        </p>
      </CardContent>
    </Card>
  );
};

export default MedicineDescriptionCard;
