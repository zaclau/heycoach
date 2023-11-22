import React, { useEffect, useState , Fragment} from 'react';
import { useParams, useNavigate } from "react-router";
import ListingCard from "../../components/listingCard/ListingCard"
import SocialMediaCard from "../../components/socialMedia/SocialMediaCard";
import ReviewComments from "../../components/reviewComments/ReviewComments";
import { graphQLFetch } from "../../graphQL/graphQLFetch";


function CoachProfile() {
    const params = useParams();
    const navigate = useNavigate();

    // Variables
    const [coach, setCoach] = useState(null);
    const [validSessions, setValidSessions] = useState([]);


    useEffect(() => {
        fetchCoach();
    }, []);


    const fetchCoach = async () => {
        const query = `
            query GetUserById($userId: ID!) {
                getUserById(userId: $userId) {
                    _id
                    firstName
                    lastName
                    profilePicture
                    profileAsCoach {
                        description
                        tagsOfSpecialties
                        sessionDuration
                        sessionPrice
                    }
                }
            }
        `;

        // Use the coach ID from the URL parameters
        const vars = {
            userId: params.coachId,
        };

        const data = await graphQLFetch(query, vars);
        if (data) {
            setCoach(data.getUserById);
            await fetchSessionsWithReviews();
        }
    };

    const fetchSessionsWithReviews = async () => {

        const sessionsQuery = `
            query GetAllSessionsForUser($userId: ID!) {
                getAllSessionsForUser(userId: $userId) {
                    _id
                    coacheeId
                    review {
                        text
                        rating
                    }
                }
            }
            `;

        const sessionsVars = { userId: params.coachId };
        const sessionsData = await graphQLFetch(sessionsQuery, sessionsVars);

        if (sessionsData) {
            console.log("Sessions Data:", sessionsData);
            const sessionsWithReviews = sessionsData.getAllSessionsForUser.filter(session => session.review !== null);

            // Fetch coachee details for each session
            for (let session of sessionsWithReviews) {
                session.coacheeDetails = await fetchCoacheeDetails(session.coacheeId);
            }

            setValidSessions(sessionsWithReviews);
        }
    };

    const fetchCoacheeDetails = async (coacheeId) => {
        const coacheeQuery = `
            query GetUserById($userId: ID!) {
                getUserById(userId: $userId) {

                    firstName
                    lastName
                    profilePicture
                }
            }
        `;

        const coacheeVars = { userId: coacheeId };
        const coacheeData = await graphQLFetch(coacheeQuery, coacheeVars);

        return coacheeData ? coacheeData.getUserById : null;
    };

    const handleScheduleSession = () => {
        navigate("/bookings", { state: {coach: coach} });
    }


    // Render a loading state until the coach data is fetched
    if (!coach) return <p>Loading...</p>;

    // Log session data to console
    // Debugs
    console.log("Valid Sessions:", validSessions);

    return (
        <>
            <div className="container-xxl bd-gutter">
                <ListingCard
                    key={coach._id}
                    firstName={coach.firstName}
                    lastName={coach.lastName}
                    description={coach.profileAsCoach.description}
                    price={coach.profileAsCoach.sessionPrice}
                    profilePicture={coach.profilePicture}
                    buttonDesc="Schedule a Session"
                    buttonAction={() => handleScheduleSession()}
                />
                <hr></hr>

                <h3 className="fw-semibold mt-4">What Others Say</h3>
                <div className="container">

                    {validSessions.map(session => (
                        <ReviewComments
                            // key={session._id}
                            coacheeProfileUrl={session.coacheeDetails.profilePicture}
                            coacheeName= {session.coacheeDetails.firstName + " " + session.coacheeDetails.lastName}
                            reviewDescription={session.review.text}
                            reviewScore={session.review.rating}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default CoachProfile;

//############################################
// Original Implementation by Z & J
//############################################

// import React from 'react';import { Fragment } from "react";
// import { useParams, useNavigate } from "react-router";
// import ListingCard from "../../components/listingCard/ListingCard"
// import SocialMediaCard from "../../components/socialMedia/SocialMediaCard";
// import ReviewComments from "../../components/reviewComments/ReviewComments";
//
// function CoachProfile() {
//     const params = useParams();
//     // console.log(params.coachId);
//
//     const navigate = useNavigate();
//
//     return (
//         <Fragment>
//             <div className="container-xxl bd-gutter">
//                 <ListingCard buttonDesc="Schedule a Session" buttonAction={() => navigate("/bookings")}/>
//                 <hr></hr>
//                 <h3 className="fw-semibold my-4">Social Feed</h3>
//                 <div className="container">
//                     <div className="row">
//                         <SocialMediaCard />
//                         <SocialMediaCard />
//                         <SocialMediaCard />
//                         <SocialMediaCard />
//                     </div>
//                 </div>
//
//                 <h3 className="fw-semibold mt-4">What Others Say</h3>
//                 <div className="container">
//                     <ReviewComments />
//                     <ReviewComments />
//                     <ReviewComments />
//                     <ReviewComments />
//                 </div>
//             </div>
//         </Fragment>
//     );
// }
//
// export default CoachProfile;