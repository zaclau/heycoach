import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import ListingCardForSession from "../../components/listingCardForSession/ListingCardForSession";
import { graphQLFetch } from '../../graphQL/graphQLFetch';

const ListingsForSessionsUpcoming = ({ userId }) => {
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSessions();
    }, [userId]);

    const fetchSessions = async () => {
        const sessionsQuery = `
            query GetAllSessionsForUser($userId: ID!) {
                getAllSessionsForUser(userId: $userId) {
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
                    buttonAction={() => navigate(`/coaches/${session.coachId}`)}
                />
            ))}
        </div>
    );
};

export default ListingsForSessionsUpcoming;

