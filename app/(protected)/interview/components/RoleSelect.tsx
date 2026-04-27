import { roleOptions } from "../constants";
import type { Role } from "../types";
import FieldError from "./FieldError";

type RoleSelectProps = {
  value: Role | "";
  error?: string;
  onChange: (value: Role | "") => void;
};

export default function RoleSelect({ value, error, onChange }: RoleSelectProps) {
  return (
    <div className="mt-6 border-t border-[#dcebea] pt-6">
      <label htmlFor="role" className="text-sm font-semibold text-[#101616]">
        Role
      </label>
      <select
        id="role"
        value={value}
        onChange={(event) => onChange(event.target.value as Role | "")}
        className="mt-2 w-full rounded-lg border border-[#cfe3e1] bg-white px-4 py-3 text-sm font-medium text-[#101616] outline-none transition-colors focus:border-[#17a1a6] focus:ring-2 focus:ring-[#17a1a6]/20"
      >
        <option value="">Select a role</option>
        {roleOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <FieldError message={error} />
    </div>
  );
}
