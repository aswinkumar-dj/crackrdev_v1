import { FiX } from "react-icons/fi";
import DifficultySummary from "./DifficultySummary";
import RoleBreakdownGrid from "./RoleBreakdownGrid";

export default function InstructionsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#101616]/35 px-4 py-6 backdrop-blur-sm transition-opacity duration-200 ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="instructions-title"
        className={`max-h-[88vh] w-full max-w-6xl overflow-y-auto rounded-lg border border-[#dcebea] bg-white text-left shadow-2xl transition-all duration-200 ${
          isOpen ? "translate-y-0 scale-100" : "translate-y-2 scale-[0.98]"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#dcebea] px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#127d82]">
              Interview guide
            </p>
            <h2
              id="instructions-title"
              className="mt-2 text-2xl font-bold tracking-tight text-[#101616] sm:text-3xl"
            >
              How It Works
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#536461] sm:text-base">
              Your interview structure is determined by your role and difficulty level.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[#536461] transition-colors hover:bg-[#e8f5f4] hover:text-[#101616] focus:outline-none focus:ring-2 focus:ring-[#17a1a6]/40"
            aria-label="Close instructions"
          >
            <FiX className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <RoleBreakdownGrid />
        <DifficultySummary />
      </div>
    </div>
  );
}
