// SUPPORT
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { graphQLFetch } from '../../graphQL/graphQLFetch';

// COMPONENETS
import ListingCardForSession from "../../components/listingCardForSession/ListingCardForSession";
import ModelForSessionCancellation from "../../modals/ModelForSessionCancellation";


const ListingsForSessionsUpcoming = ({ userId }) => {

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
    }, [userId]);

    //############################################
    // MODAL HANDLERS
    //############################################

    const handleCancelClick = (session) => {
        console.log("cancel clicked", session)
        setCurrentSession(session);
        setShowModal(true);
    };

    const handleConfirmCancellation = async () => {
        console.log("session cancelled", currentSession);
        // TODO: add logic to update DB using updateSession. Status to be "CANCELLED"
        const updateSessionQuery = `
        mutation UpdateExistingSession($sessionId: ID!, $updatedSessionDetails: InputCoachSession) {
          updateExistingSession(sessionId: $sessionId, updatedSessionDetails: $updatedSessionDetails) {
            _id
            status
          }
        }
        `;

        const vars = {
            sessionId: currentSession._id,
            updatedSessionDetails: {
                status: "CANCELLED"
            }
        }
        const data = await graphQLFetch(updateSessionQuery, vars);
        console.log("Session status updated", data);
        await fetchSessions();
        setShowModal(false);
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
                }
            }
        `;
        const vars = { userId };
        const data = await graphQLFetch(sessionsQuery, vars);
        const upcomingSessions = data.getAllSessionsForUser.filter(session => session.status === "SCHEDULED");
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
                <ListingCardForSession
                    coacheePicUrl={session.coacheePicUrl}
                    coachPicUrl={session.coachPicUrl}
                    coachName={session.coachName}
                    coacheeName={session.coacheeName}
                    sessionDateTime={session.dateTime}
                    sessionLocation={session.location}
                    buttonLabel="Cancel Session"
                    buttonAction={() => handleCancelClick(session)}
                />
            ))}
            {showModal && (
                <ModelForSessionCancellation
                    show = {showModal}
                    onConfirm={handleConfirmCancellation}
                    onCancel={handleCloseModal}
                />
            )}>
        </div>
    );
};

export default ListingsForSessionsUpcoming;

