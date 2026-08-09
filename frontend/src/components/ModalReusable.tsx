import { IoCloseCircleOutline } from "react-icons/io5";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
    >
      {/* kontener modala */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-[72rem] overflow-y-auto rounded-xl border border-neutral-200 bg-white p-7 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 sm:p-10"
      >
        {/* przycisk zamknięcia */}
        <button
          className="absolute right-5 top-5 cursor-pointer text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          onClick={onClose}
        >
          <IoCloseCircleOutline className="h-10 w-10" />
        </button>

        {/* zawartość */}
        <div>{children}</div>
      </div>
    </div>
  );
}
