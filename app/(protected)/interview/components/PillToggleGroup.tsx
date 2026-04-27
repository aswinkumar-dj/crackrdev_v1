import { activePillClass, inactivePillClass } from "../constants";
import FieldError from "./FieldError";

type PillToggleGroupProps<T extends string> = {
  label: string;
  options: readonly T[];
  value: T | "";
  error?: string;
  columnsClass: string;
  getInactiveClass?: (option: T) => string;
  onChange: (value: T) => void;
};

export default function PillToggleGroup<T extends string>({
  label,
  options,
  value,
  error,
  columnsClass,
  getInactiveClass,
  onChange,
}: PillToggleGroupProps<T>) {
  return (
    <div className="mt-6">
      <p className="text-sm font-semibold text-[#101616]">{label}</p>
      <div className={`mt-3 grid gap-3 ${columnsClass}`}>
        {options.map((option) => {
          const isActive = value === option;
          const inactiveClass = getInactiveClass
            ? getInactiveClass(option)
            : inactivePillClass;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                isActive ? activePillClass : inactiveClass
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      <FieldError message={error} />
    </div>
  );
}
