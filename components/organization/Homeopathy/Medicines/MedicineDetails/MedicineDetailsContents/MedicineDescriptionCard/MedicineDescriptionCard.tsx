import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Medicine } from '@/types/Organization/Homeopathy/Medicines/MedicinesType';

type Props = {
  medicine: Medicine;
};

const MedicineDescriptionCard: React.FC<Props> = ({ medicine }) => {
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