export default function SubmitButton({
  disabled,
  error,
  isSubmitting,
}: {
  disabled: boolean;
  error?: string;
  isSubmitting: boolean;
}) {
  return (
    <div className="mt-8">
      <button
        type="submit"
        disabled={disabled}
        className="flex min-h-12 w-full items-center justify-center rounded-lg bg-[#17a1a6] px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#12898e] focus:outline-none focus:ring-2 focus:ring-[#17a1a6]/50 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:hover:bg-gray-300"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Starting...
          </span>
        ) : (
          "Start Interview"
        )}
      </button>
      {error ? (
        <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
