import React from 'react';

const ListingCard = ({ firstName, lastName, description, price, profilePicture, buttonDesc, buttonAction }) => {
    return (
        <div className="container d-flex justify-content-center p-2">
            <div className="col-8 p-4 border border-1 rounded-4 shadow">
                <div className="d-flex flex-row">
                    <div className="col-3 d-flex flex-column justify-content-between">
                        <div className="row">
                            <img
                                src={profilePicture}
                                alt={`${firstName} ${lastName}`}
                                className="img-fluid object-fit-cover"
                                style={{ height: '150px' }} // Ensures the image takes up the desired height
                            />
                            <p></p>
                            <h3 className="fw-semibold">${price.toFixed(2)}</h3>
                            <p className="text-muted">/session</p>
                        </div>
                        {/*<div> /!* Added a div for styling the price *!/*/}
                        {/*    /!* Changed toFixed(2) to show two decimal places *!/*/}
                        {/*</div>*/}
                    </div>
                    <div className="col-9 ps-4"> {/* Adjusted column size for description */}
                        <h3 className="fw-bold">{firstName} {lastName.charAt(0)}.</h3>
                        <p className="flex-grow-1">{description}</p> {/* flex-grow-1 will allow the paragraph to expand */}
                        {buttonDesc && <button className="btn btn-dark mt-3" onClick={buttonAction}>{buttonDesc}</button>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListingCard;

// import React from 'react';
//
// const ListingCard = ({ firstName, lastName, description, price, profilePicture, buttonDesc, buttonAction }) => {
//     return (
//         <div className="container d-flex justify-content-center p-2">
//             <div className="col-8 p-4 border border-1 rounded-4 shadow">
//                 <div className="d-flex flex-row">
//                     <div className="col-3">
//                         <div className="row d-flex" style={{height: "150px"}}>
//                             <img
//                                 src={profilePicture}
//                                 alt={`${firstName} ${lastName}`}
//                                 className="img-fluid object-fit-cover h-100"
//                             />
//                         </div>
//                         <h3 className="fw-semibold">${price.toFixed(0)}/sesh</h3>
//                     </div>
//                     <div className="col-5 ps-4">
//                         <h3 className="fw-bold">{firstName} {lastName.charAt(0)}.</h3>
//                         <p>{description}</p>
//                         {buttonDesc && <button className="btn btn-dark" onClick={buttonAction}>{buttonDesc}</button>}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
//
// export default ListingCard;


// import React from 'react';
// const ListingCard = ({ buttonDesc, buttonAction }) => {
//     return (
//         // 2 columns: 1 for picture and pricing, 1 for details on the right
//         <div className="container d-flex justify-content-center p-2">
//             <div className="col-8 p-4 border border-1 rounded-4 shadow">
//                 <div className="d-flex flex-row">
//                     <div className="col-3">
//                         <div className="row d-flex" style={{height:"150px"}}>
//                             <img
//                                 src="data:image/jpeg;base64,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"
//                                 alt=""
//                                 className="img-fluid object-fit-cover h-100"
//                             />
//                         </div>
//
//                         <h3 className="fw-semibold">$XXX/session</h3>
//                     </div>
//                     <div className="col-5 ps-4">
//                         <h3 className="fw-bold">Name of Person</h3>
//                         <p>profile blurb</p>
//                         <p>long description of mentor</p>
//
//                         {buttonDesc && <button className="btn btn-dark" onClick={ buttonAction }>{ buttonDesc }</button>}
//                     </div>
//                 </div>
//             </div>
//
//         </div>
//     )
// }
//
// export default ListingCard