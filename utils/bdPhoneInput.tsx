import { Input } from '@/components/ui/input';

export const BdPhoneInput = ({
  id,
  value,
  onChange,
  required = false,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) => (
  <div className='flex'>
    <span className='border-input bg-primary flex shrink-0 items-center gap-1 rounded-lg rounded-r-none border-r px-3 text-sm font-medium whitespace-nowrap text-white'>
      (+88) BD
    </span>
    <Input
      id={id}
      type='tel'
      inputMode='numeric'
      placeholder='Enter phone number'
      value={value}
      onChange={(e) => {
        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 11);
        onChange(digitsOnly);
      }}
      className='rounded-l-none!'
      required={required}
    />
  </div>
);
