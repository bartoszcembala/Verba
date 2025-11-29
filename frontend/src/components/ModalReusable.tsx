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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* kontener modala */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg  w-300 h-230 px-14 py-10 relative ">
        {/* przycisk zamknięcia */}
        <button
          className="absolute cursor-pointer top-4 right-6  "
          onClick={onClose}
        >
          <IoCloseCircleOutline className="w-18 h-18 transition hover:text-indigo-400 text-indigo-300" />
        </button>

        {/* zawartość */}
        <div>{children}</div>
      </div>
    </div>
  );
}
