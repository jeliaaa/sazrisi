import { useController, Control, FieldValues, Path } from "react-hook-form";

interface ControlledInputProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  type?: string;
  placeholder?: string;
}

const ControlledInput = <T extends FieldValues>({
  name,
  label,
  control,
  type = "text",
  placeholder,
}: ControlledInputProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <div>
      <label className="text-lg font-medium text-dark-color">
        <span className="text-base">{label}</span>
      </label>
      <input
        {...field}
        type={type}
        placeholder={placeholder}
        className={`w-full mt-2 px-3 py-2 border rounded-md text-md text-dark-color shadow-sm focus:outline-none focus:ring-2 focus:ring-main-color focus:border-main-color ${
          error ? "border-red-500" : "border-dark-color"
        }`}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error.message}</p>
      )}
    </div>
  );
};

export default ControlledInput;
