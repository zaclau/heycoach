import React from 'react';

const ListingCardForCoach = ({ firstName, lastName, description, price, profilePicture, buttonDesc, buttonAction }) => {
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
                            {/*<h3 className="fw-semibold">${price.toFixed(2)}</h3>*/}
                            <h3 className="fw-semibold">${price}</h3>
                            <p className="text-muted">/session</p>
                        </div>
                        {/*<div> /!* Added a div for styling the price *!/*/}
                        {/*    /!* Changed toFixed(2) to show two decimal places *!/*/}
                        {/*</div>*/}
                    </div>
                    <div className="col-9 ps-4"> {/* Adjusted column size for description */}
                        {/*<h3 className="fw-bold">{firstName} {lastName.charAt(0)}.</h3>*/}
                        <h3 className="fw-bold">{firstName} {lastName}</h3>
                        <p className="flex-grow-1">{description}</p> {/* flex-grow-1 will allow the paragraph to expand */}
                        {buttonDesc && <button className="btn btn-dark mt-3" onClick={buttonAction}>{buttonDesc}</button>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListingCardForCoach;
