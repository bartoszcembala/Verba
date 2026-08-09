import { FiX } from "react-icons/fi";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ModalReusable({
  isOpen,
  onClose,
  children,
}: ModalProps) {
  if (!isOpen) return null; // nie renderuj nic, jeśli modal zamknięty

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-[2px] sm:p-6"
    >
      {/* kontener modala */}
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        className="relative max-h-[92vh] w-full max-w-[64rem] overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
      >
        {/* przycisk zamknięcia */}
        <button
          className="absolute right-5 top-5 z-10 grid h-10 w-10 cursor-pointer place-items-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <FiX className="h-8 w-8" />
        </button>

        {/* zawartość */}
        <div>{children}</div>
      </div>
    </div>
  );
}
