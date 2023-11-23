// SUPPORT
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { graphQLFetch } from '../../graphQL/graphQLFetch';

// COMPONENETS
import ListingCardForSessionCompleted from "../../components/listingCard/ListingCardForSessionCompleted";
import ModalForReviews from "../../modals/ModalForReview/ModalForReviews";


const ListingsForSessionsUpcoming = ({ userId, refreshTrigger }) => {

    //############################################
    // VARIABLES
    //############################################

    const [sessions, setSessions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentSession, setCurrentSession] = useState(null); // TODO: what is currentSession For?
    const navigate = useNavigate();

    // TODO replace with userId from context
    useEffect(() => {
        fetchSessions();
    }, [userId, refreshTrigger]);

    //############################################
    // MODAL HANDLERS
    //############################################

    const handleReviewClick = (session) => {
        console.log("review clicked", session)
        setCurrentSession(session);
        setShowModal(true);
    };

    const handleReviewSubmit = async (reviewData) => {
        console.log("review submission", currentSession);
        const mutation = `
            mutation UpdateExistingSession($sessionId: ID!, $updatedSessionDetails: InputCoachSession!) {
                updateExistingSession(sessionId: $sessionId, updatedSessionDetails: $updatedSessionDetails) {
                    _id
                    review {
                        text
                        rating
                    }
                }
            }
        `;

        const vars = {
            sessionId: currentSession._id,
            updatedSessionDetails: {
                review:{
                    text: reviewData.text,
                    rating: reviewData.rating
                }
            }
        };

        const data = await graphQLFetch(mutation, vars);
        console.log("review updates", vars);
        console.log("review updated", data);

        setShowModal(false);
        await fetchSessions();
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    //############################################
    // COACH SESSION HANDLERS
    //############################################

    const fetchSessions = async () => {
        const sessionsQuery = `
            query GetAllSessionsForUser($userId: ID!) {
                getAllSessionsForUser(userId: $userId) {
                    _id
                    coachId
                    coacheeId
                    dateTime
                    status
                    location
                    review {
                        text
                        rating
                    }
                }
            }
        `;
        const vars = { userId };
        const data = await graphQLFetch(sessionsQuery, vars);
        const upcomingSessions = data.getAllSessionsForUser.filter(session => session.status === "COMPLETED");
        const sessionDetails = await Promise.all(upcomingSessions.map(async session => {
            const coacheeDetails = await fetchUserDetails(session.coacheeId);
            const coachDetails = await fetchUserDetails(session.coachId);
            return {
                ...session,
                coacheeName: coacheeDetails.firstName,
                coacheePicUrl: coacheeDetails.profilePicture,
                coachName: coachDetails.firstName,
                coachPicUrl: coachDetails.profilePicture,
            };
        }));
        setSessions(sessionDetails);
    };

    const fetchUserDetails = async (userId) => {
        const userQuery = `
            query GetUserById($userId: ID!) {
                getUserById(userId: $userId) {
                    firstName
                    lastName
                    profilePicture
                }
            }
        `;
        const vars = { userId };
        const data = await graphQLFetch(userQuery, vars);
        return data.getUserById;
    };

    //############################################
    // RENDERS
    //############################################

    return (
        <div>
            {sessions.map(session => (
                <ListingCardForSessionCompleted
                    coacheePicUrl={session.coacheePicUrl}
                    coachPicUrl={session.coachPicUrl}
                    coachName={session.coachName}
                    coacheeName={session.coacheeName}
                    review={session.review}
                    buttonLabel="Submit Review"
                    buttonAction={() => handleReviewClick(session)}
                />
            ))}
            {showModal && (
                <ModalForReviews
                    show = {showModal}
                    onConfirm={handleReviewSubmit}
                    onCancel={handleCloseModal}
                />
            )}
        </div>
    );
};

export default ListingsForSessionsUpcoming;

