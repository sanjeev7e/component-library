export default function Input({ label, placeholder, type, inputClassName, labelClassName, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string, placeholder?: string, type?: string, inputClassName?: string, labelClassName?: string }) {
  return (
    <label className={labelClassName}>
      {label}
      <input className={inputClassName} type={type} placeholder={placeholder} {...props} />
    </label>
  );
}
