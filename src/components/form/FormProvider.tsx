import React, { useCallback, createContext, useContext } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn, FieldValues, SubmitHandler, UseFormProps } from 'react-hook-form';
import { ZodSchema } from 'zod';
interface FormProviderProps<T extends FieldValues> extends UseFormProps<T> {
  children: React.ReactNode;
  onSubmit: SubmitHandler<T>;
  schema: ZodSchema<T>;
}
const FormContext = createContext<UseFormReturn<any> | null>(null);
export function FormProvider<T extends FieldValues>({
  children,
  onSubmit,
  schema,
  ...formProps
}: FormProviderProps<T>) {
  const methods = useForm<T>({
    ...formProps,
    resolver: zodResolver(schema)
  });
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    await methods.handleSubmit(onSubmit)(e);
  }, [methods, onSubmit]);
  return <FormContext.Provider value={methods}>
      <form onSubmit={handleSubmit}>{children}</form>
    </FormContext.Provider>;
}
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};