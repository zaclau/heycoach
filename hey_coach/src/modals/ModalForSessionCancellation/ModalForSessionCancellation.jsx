import React from 'react';

const ModalForSessionCancellation = ({ show, onConfirm, onCancel }) => {
    // Inline styles for the modal backdrop
    const backdropStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent black
        zIndex: 1040, // Ensure this is below the modal's z-index
        display: show ? 'block' : 'none',
    };

    // Inline styles for the modal
    const modalStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1050,
        display: show ? 'block' : 'none',
    };

    if (!show) {
        return null;
    }

    return (
        <>
            {/* Backdrop */}
            <div style={backdropStyle}></div>

            {/* Modal */}
            <div className="modal" style={modalStyle}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Cancellation?</h5>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to cancel this session?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-dark btn-sm" onClick={onCancel}>No</button>
                            <button className="btn btn-danger btn-sm" onClick={onConfirm}>Yes, Cancel Session</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModalForSessionCancellation;

//############################################
// Without Blackout
//############################################

// import React from 'react';
//
// const ModalForSessionCancellation = ({ show, onConfirm, onCancel }) => {
//     if (!show) {
//         return null;
//     }
//
//     return (
//         <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }}>
//             <div className="modal-dialog">
//                 <div className="modal-content">
//                     <div className="modal-header">
//                         <h5 className="modal-title">Confirm Cancellation</h5>
//                     </div>
//                     <div className="modal-body">
//                         <p>Are you sure you want to cancel this session?</p>
//                     </div>
//                     <div className="modal-footer">
//                         <button className="btn btn-dark btn-sm" onClick={onCancel}>No</button>
//                         <button className="btn btn-danger btn-sm" onClick={onConfirm}>Yes, Cancel Session</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default ModalForSessionCancellation;


//############################################
// Basic and Ugly
//############################################

// import React from 'react';
//
// const ModalForSessionCancellation = ({ showModal, onCancel, onConfirm }) => {
//   return (
//     <div className={`modal ${showModal ? 'd-block' : 'd-none'}`} tabIndex="-1">
//       <div className="modal-dialog">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">Confirm Cancellation</h5>
//             <button type="button" className="btn-close" onClick={onCancel}></button>
//           </div>
//           <div className="modal-body">
//             <p>Are you sure you want to cancel this session?</p>
//           </div>
//           <div className="modal-footer">
//             <button type="button" className="btn btn-secondary" onClick={onCancel}>
//               Close
//             </button>
//             <button type="button" className="btn btn-primary" onClick={onConfirm}>
//               Confirm
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default ModalForSessionCancellation;
