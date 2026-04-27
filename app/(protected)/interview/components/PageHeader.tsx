import { FiInfo } from "react-icons/fi";

export default function PageHeader({
  onOpenInstructions,
}: {
  onOpenInstructions: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpenInstructions}
      className="absolute right-4 top-6 z-10 inline-flex items-center gap-2 rounded-lg border border-[#bfe4e2] bg-white px-4 py-2 text-sm font-semibold text-[#127d82] shadow-sm transition-colors hover:border-[#17a1a6] hover:bg-[#e8f5f4] focus:outline-none focus:ring-2 focus:ring-[#17a1a6]/50 focus:ring-offset-2 focus:ring-offset-[#f8fbfb] sm:right-6 lg:right-8"
    >
      <FiInfo className="h-4 w-4" aria-hidden="true" />
      <span>Read Instructions</span>
    </button>
  );
}
