import React from 'react';

function ReviewComments({
    coacheeProfileUrl = 'https://en.wikipedia.org/wiki/File:Northern_cardinal_female_in_CP_(02035).jpg',
    coacheeName = 'Anonymous',
    reviewDescription = 'No review provided.',
    reviewScore = 0
}) {
    // Inline styles for image sizing, shape, and margin
    const profileImageStyle = {
        width: '50px',        // Set image width
        height: '50px',       // Set image height
        borderRadius: '50%',  // Make it circular
        objectFit: 'cover',   // Ensure the image covers the area without distortion
        marginRight: '16px',  // Add right margin
    };

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="d-flex align-items-center">
                    <img
                        className="shadow"
                        src={coacheeProfileUrl}
                        alt={`${coacheeName}'s profile`}
                        style={profileImageStyle}  // Apply inline styles
                    />
                    <div>
                        <div className="fw-semibold">{coacheeName}</div>
                        <div className="fw-light">rating: {reviewScore} / 5</div>
                        <div>{reviewDescription}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewComments;
