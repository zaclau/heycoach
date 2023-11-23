import React from 'react';

const ListingCardForSessionUpcoming = ({
                                   coacheePicUrl,
                                   coachPicUrl,
                                   coachName,
                                   coacheeName,
                                   sessionDateTime,
                                   sessionLocation,
                                   buttonActionCancel,
                                   buttonActionComplete,
                               }) => {

    const formatDate = (dateTime) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateTime).toLocaleDateString(undefined, options);
    };

    const formatTime = (dateTime) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(dateTime).toLocaleTimeString(undefined, options);
    };

    const profileImageStyle = {
        width: '75px',        // Set image width
        height: '75px',       // Set image height
        borderRadius: '50%',  // Make it circular
        objectFit: 'cover',   // Ensure the image covers the area without distortion
        marginRight: '5px',  // Add right margin
    };

    return (
        <div className="container d-flex justify-content-center p-2">
            <div className="col-10 p-4 border border-1 rounded-4 shadow" style={{ backgroundColor: '#ffffff' }}>
                <div className="d-flex flex-row align-items-center">
                    <div className="col-3 d-flex justify-content-around">
                        <img src={coachPicUrl} alt="Coach" className="img-thumbnail" style={profileImageStyle} />
                        <img src={coacheePicUrl} alt="Coachee" className="img-thumbnail" style={profileImageStyle} />
                    </div>
                    <div className="col-3 ps-4 justify-content-center">
                        <h3 className="fw-bold">{coachName}</h3>
                        <p>x</p>
                        <h3 className="fw-bold">{coacheeName}</h3>
                    </div>
                    <div className="col-5 text-secondary">
                        <p className="mb-0 small"><b>Date</b> {formatDate(sessionDateTime)}</p>
                        <p className="mb-0 small"><b>Time</b> {formatTime(sessionDateTime)}</p>
                        <p className="mb-2 small"><b>Address</b> {sessionLocation}</p>
                        {/*<p className="mb-2 small"><b>Fee</b> ${sessionCost}</p>*/}
                        <button className="btn btn-dark btn-sm me-2" onClick={buttonActionCancel}>Cancel Session</button>
                        <button className="btn btn-success btn-sm" onClick={buttonActionComplete}>Mark Complete!</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListingCardForSessionUpcoming;

// import React from 'react';
//
// const ListingCardForSession = ({ firstName, lastName, description, price, profilePicture, buttonDesc, buttonAction }) => {
//     return (
//         <div className="container d-flex justify-content-center p-2">
//             <div className="col-8 p-4 border border-1 rounded-4 shadow">
//                 <div className="d-flex flex-row">
//                     <div className="col-3 d-flex flex-column justify-content-between">
//                         <div className="row">
//                             <img
//                                 src={profilePicture}
//                                 alt={`${firstName} ${lastName}`}
//                                 className="img-fluid object-fit-cover"
//                                 style={{ height: '150px' }} // Ensures the image takes up the desired height
//                             />
//                             <p></p>
//                             {/*<h3 className="fw-semibold">${price.toFixed(2)}</h3>*/}
//                             <h3 className="fw-semibold">${price}</h3>
//                             <p className="text-muted">/session</p>
//                         </div>
//                         {/*<div> /!* Added a div for styling the price *!/*/}
//                         {/*    /!* Changed toFixed(2) to show two decimal places *!/*/}
//                         {/*</div>*/}
//                     </div>
//                     <div className="col-9 ps-4"> {/* Adjusted column size for description */}
//                         {/*<h3 className="fw-bold">{firstName} {lastName.charAt(0)}.</h3>*/}
//                         <h3 className="fw-bold">{firstName} {lastName}</h3>
//                         <p className="flex-grow-1">{description}</p> {/* flex-grow-1 will allow the paragraph to expand */}
//                         {buttonDesc && <button className="btn btn-dark mt-3" onClick={buttonAction}>{buttonDesc}</button>}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
//
// export default ListingCardForSession;
