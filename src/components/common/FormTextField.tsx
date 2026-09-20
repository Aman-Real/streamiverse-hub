import type { HTMLInputTypeAttribute, ReactNode } from "react";
import type { Control, ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormTextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  placeholder?: string;
  /** react-hook-form validation, e.g. { required: "Enter your email" }. */
  rules?: ControllerProps<T>["rules"];
  /** Shown at the right end of the label row, e.g. a "Forgot password?" link. */
  labelAction?: ReactNode;
  disabled?: boolean;
}

/** Labelled text input with its validation message, for any react-hook-form form. */
const FormTextField = <T extends FieldValues>({ control, name, label, rules, labelAction, disabled, ...inputProps }: FormTextFieldProps<T>) => (
  <FormField
    control={control}
    name={name}
    rules={rules}
    render={({ field }) => (
      <FormItem>
        <div className="flex items-center justify-between gap-3">
          <FormLabel>{label}</FormLabel>
          {labelAction}
        </div>
        <FormControl>
          <Input {...inputProps} {...field} value={field.value ?? ""} disabled={disabled ?? field.disabled} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default FormTextField;
