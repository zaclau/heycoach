import React, { useEffect, useState , Fragment} from 'react';
import { useParams, useNavigate } from "react-router";
import ListingCardForCoach from "../../components/listingCard/ListingCardForCoach"
import SocialMediaCard from "../../components/socialMedia/SocialMediaCard";
import ReviewComments from "../../components/reviewComments/ReviewComments";
import { graphQLFetch } from "../../graphQL/graphQLFetch";
import Axios from 'axios';


function CoachProfile() {
    const params = useParams();
    const navigate = useNavigate();

    // Variables
    const [coach, setCoach] = useState(null);
    const [validSessions, setValidSessions] = useState([]);
    const [instagramMedia, setInstagramMedia] = useState(null);
    const instagramMediaFields = 'caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username';
    const instagramMediaLimit = 5;

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
                    instagramAccessToken
                    profileAsCoach {
                        description
                        tagsOfSpecialties
                        sessionDuration
                        sessionPrice
                        location
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
            await fetchInstragramMedia(data.getUserById.instagramAccessToken);
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

    const fetchInstragramMedia = async (accessToken) => {
        console.log('fetchInstragramMedia entered. ');
        if (!accessToken) return;

        // Call backend to fetch instagram media
        const api = Axios.create({
            baseURL: process.env.REACT_APP_DOMAIN,
            timeout: 5000,  // abort if request takes longer than 5 seconds
            headers: {'Content-Type': 'application/json'},
        });
        try {
            const response = await api.post('api/v1/instagram/fetch-media', { 
                fields: instagramMediaFields, 
                access_token: accessToken,
                limit: instagramMediaLimit
            });
            console.log('response: ', response);
            setInstagramMedia(response.data);
        } catch (error) {
            console.log('error: ', error);
        }
    }


    // Render a loading state until the coach data is fetched
    if (!coach) 
        return <div className='container-xxl bd-gutter'>
                    <div className='d-flex flex-column justify-content-center align-items-center' style={{height: "100vh"}}>
                        <div className='spinner-grow text-secondary'></div>
                        <h4 className='text-center text-secondary mt-2'>Loading...</h4>
                    </div>
                </div>;

    // Log session data to console
    // Debugs
    console.log("Valid Sessions:", validSessions);
    console.log("Instagram media", instagramMedia);

    return (
        <>
            <div className="container-xxl bd-gutter">
                <ListingCardForCoach
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

                {instagramMedia && 
                    <>
                        <h3 className="fw-semibold mt-4">Recent Posts</h3>
                        <div className="container d-flex flex-row mb-3">
                            {instagramMedia.map(media => (
                                <SocialMediaCard
                                    key={media.id}
                                    url={media.media_url}
                                    mediaType={media.media_type}
                                    caption={media.caption}
                                    timestamp={media.timestamp}
                                    username={media.username}
                                    permalink={media.permalink}
                                />
                            ))}
                        </div>
                        <hr></hr>
                    </>}
                

                <h3 className="fw-semibold mt-4">What Others Say</h3>
                <div className="container">

                    {validSessions 
                        ? validSessions.map(session => (
                            <ReviewComments
                                // key={session._id}
                                coacheeProfileUrl={session.coacheeDetails.profilePicture}
                                coacheeName= {session.coacheeDetails.firstName + " " + session.coacheeDetails.lastName}
                                reviewDescription={session.review.text}
                                reviewScore={session.review.rating}
                            />)) 
                        : <text>No reviews found.</text>}
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