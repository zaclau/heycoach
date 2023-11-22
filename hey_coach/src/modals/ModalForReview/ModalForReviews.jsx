import React, { useState } from 'react';

const ModalForReviews = ({ show, onConfirm, onCancel }) => {
    // State for form fields
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");

    //############################################
    // Inline styles for modal backdrop and content
    //############################################

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

    //############################################
    // Handler for form submission
    //############################################

    const handleSubmit = async (event) => {
        // Prevent default form submission behavior
        event.preventDefault();

        // Check if a rating was selected
        if (!rating) {
            alert('Please select a rating.');
            return;
        }

        // Prepare the review data
        const reviewData = {
            rating,
            text: review,
        };

        // Call the onConfirm prop, which should be responsible for the mutation
        onConfirm(reviewData);

        // Reset form fields
        setRating(null);
        setReview('');
    };

    if (!show) {
        return null;
    }

    return (
        <>
            <div style={backdropStyle}></div>
            <div className="modal" style={modalStyle}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Session Review</h5>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <p>Rating:</p>
                                    <div className="d-flex justify-content-start">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <div key={num} className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="rating"
                                                    id={`rating${num}`}
                                                    value={num}
                                                    checked={rating === num}
                                                    onChange={(e) => setRating(Number(e.target.value))}
                                                />
                                                <label className="form-check-label" htmlFor={`rating${num}`}>
                                                    {num}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="reviewTextarea" className="form-label">Review:</label>
                                    <textarea
                                        className="form-control"
                                        id="reviewTextarea"
                                        rows="4"
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-dark btn-sm" onClick={onCancel}>Cancel</button>
                                <button className="btn btn-success btn-sm">Submit Review</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModalForReviews;

// import React from 'react';
//
// const ModalForReviews = ({ show, onConfirm, onCancel }) => {
//     // Inline styles for the modal backdrop
//     const backdropStyle = {
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100vw',
//         height: '100vh',
//         backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent black
//         zIndex: 1040, // Ensure this is below the modal's z-index
//         display: show ? 'block' : 'none',
//     };
//
//     // Inline styles for the modal
//     const modalStyle = {
//         position: 'fixed',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         zIndex: 1050,
//         display: show ? 'block' : 'none',
//     };
//
//     if (!show) {
//         return null;
//     }
//
//     return (
//         <>
//             {/* Backdrop */}
//             <div style={backdropStyle}></div>
//
//             {/* Modal */}
//             <div className="modal" style={modalStyle}>
//                 <div className="modal-dialog">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h5 className="modal-title">Confirm Cancellation?</h5>
//                         </div>
//                         <div className="modal-body">
//                             <p>Are you sure you want to cancel this session?</p>
//                         </div>
//                         <div className="modal-footer">
//                             <button className="btn btn-dark btn-sm" onClick={onCancel}>No</button>
//                             <button className="btn btn-danger btn-sm" onClick={onConfirm}>Yes, Cancel Session</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };
//
// export default ModalForReviews;
