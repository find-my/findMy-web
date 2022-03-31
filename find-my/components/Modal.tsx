import React, { useCallback } from 'react';
interface Props {
  show: boolean;
  onToggleModal: () => void;
  children: React.ReactNode;
}
function Modal({ show, onToggleModal, children }: Props) {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);
  if (!show) {
    return null;
  }
  return (
    <div onClick={onToggleModal} className="fixed top-0 right-0 bottom-0 left-0 z-50">
      <div
        onClick={stopPropagation}
        className="absolute shadow-md bg-white p-2 flex flex-col items-start whitespace-nowrap"
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
