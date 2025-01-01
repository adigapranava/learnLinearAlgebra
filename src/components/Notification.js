import React from 'react';

const Notification = ({ message, type }) => {
  return (
    <div
        className={`alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`}
        style={{ zIndex: 1060 }}
        role="alert"
    >
        {message}
    </div>
  );
};

export default Notification;
