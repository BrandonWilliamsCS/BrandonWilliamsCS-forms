export interface FieldProps<T> {
  disabled?: boolean;
  error?: boolean;
  id?: string;
  label: string;
  name: string;
  onValueChange: (value: T) => void;
  prefix?: string;
  readonly?: boolean;
  value: T;
}
