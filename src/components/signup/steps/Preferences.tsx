// src/components/signup/steps/Preferences.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { SignUpFormData } from '../../../types/types';

const Preferences: React.FC = () => {
  const { register, setValue, watch } = useFormContext<SignUpFormData>();
  const selectedColor = watch('preferences'); // watch the selected preference

  const colors = [
    { name: 'Red', color: 'red' },
    { name: 'Blue', color: 'blue' },
    { name: 'Green', color: 'green' },
    { name: 'Yellow', color: 'yellow' },
    { name: 'Purple', color: 'purple' },
  ];

  return (
    <div className="flex gap-4">
      {colors.map(({ color }) => (
        <div
          key={color}
          className={`w-16 h-16 cursor-pointer rounded-md border-2 ${
            selectedColor === color ? 'border-dark-color' : 'border-gray-300'
          }`}
          style={{ backgroundColor: color }}
          onClick={() => setValue('preferences', color)} // set the selected color
        >
          <input
            {...register('preferences')}
            type="radio"
            value={color}
            className="hidden"
            checked={selectedColor === color} // show selected state
          />
        </div>
      ))}
    </div>
  );
};

export default Preferences;
