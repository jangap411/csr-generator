import React from "react";

const Alert = ({ isOpen, message, handleClose }) => {
  return (
    <>
      <div
        className={
          isOpen ? "ui negative message" : "ui negative message hidden"
        }
      >
        <i className="close icon" onClick={handleClose}></i>
        <div className="header">{message}</div>
        <p></p>
      </div>
    </>
  );
};

export default Alert;
