import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000ba]"
      onClick={onClose}
    >
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer w-[30px] h-[30px] flex items-center justify-center"
        onClick={onClose}
        aria-label="Close modal"
      >
        &times;
      </button>
      <div
        className="bg-white rounded-lg shadow-lg w-[90%] lg:w-full p-6 relative max-w-[1156px] max-h-[774px] h-[90vh] overflow-y-auto d5-up-model"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal; 