import React from 'react';
import './Modal.css';

const Modal = ({ title, children, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={handleContentClick}>
        <div className="modal-handle"></div>

        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close-button" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="#9ba1a8"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
