import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicineDetailsCardProps } from '@/types/Organization/Homeopathy/Medicines/MedicinesType';

const MedicineDescriptionCard: React.FC<MedicineDetailsCardProps> = ({
  medicine,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base font-semibold'>Description</CardTitle>
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
