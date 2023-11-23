import React, { useState } from 'react';
import { useForm } from "react-hook-form"
import ListingCardForCoach from "../../components/listingCard/ListingCardForCoach"
import ErrorMessage from "../../components/errorMessage/ErrorMessage";
import CalendarPicker from "../../components/calendarpicker/CalendarPicker";
import "./bookings.css"
import { useAuthContext } from '../../auth/auth';
import { useLocation } from 'react-router-dom';
import { graphQLFetch } from '../../graphQL/graphQLFetch';
import { createCheckoutSession } from '../../../server/stripe';
import { duration } from 'moment/moment';

function Bookings() {
    const location = useLocation();
    const userManagement = useAuthContext();
    const coach = location.state.coach;
    console.log('Coach object in Bookings: ', coach);
    
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [ calendar, setCalendar ] = useState();
    const [ dtErrors, setDtErrors ] = useState();
    const handleBookSession = async (data) => {
        // Validate session datetime
        if (calendar) {
            setDtErrors(null);
        } else {
            setDtErrors('Please select a date and time for your session.');
            return;
        }

        const originalDate = new Date(calendar.$d);
        const dateTime = originalDate.toISOString();
        const status = 'SCHEDULED';

        const coachId = coach._id;
        const coacheeId = userManagement.userStore._id;

        const createSessionMutation = `
            mutation createNewSession($newSession: InputCoachSession!) {
                createNewSession(newSession: $newSession) {
                    _id
                    coachId
                    coacheeId
                    dateTime
                    status
                    location
                }
            }
        `;

        const variables = {
            newSession: {
                coachId,
                coacheeId,
                dateTime,
                status, 
        }}

        try {
            const newSession = await graphQLFetch(createSessionMutation, variables);
            if (newSession.createNewSession) {
                console.log('New session created from Bookings: ', newSession);
                // TODO: Navigate to Stripe payment
            }
        } catch (error) {
            console.log(error);
        }

        const dummy = [
            {
                price_data: {
                currency: 'sgd',
                product_data: {
                    name: 'T-shirt',
                },
                unit_amount: 2000,
                },
                quantity: 1,
            },
        ];

        localStorage.setItem('user', JSON.stringify(userManagement.userStore));
        await createCheckoutSession(dummy, userManagement.userStore.stripeCustomerId, '/#/success', '/#/bookings');
    }

    return (
        <div className="container-xxl bd-gutter">
            <ListingCardForCoach
                key={coach._id}
                firstName={coach.firstName}
                lastName={coach.lastName}
                description={coach.profileAsCoach.description}
                price={coach.profileAsCoach.sessionPrice}
                profilePicture={coach.profilePicture}
            />
            <div className="booking-form">
                <form onSubmit={handleSubmit(handleBookSession)} className="col-12">

                    <div class="row px-4">
                        <div class="col">
                            <div class="row mb-3">
                                <label className="form-label mt-2 mb-1 fw-bold">Session Date & Time</label>
                                <div id="calendar">
                                    <CalendarPicker calendar={ calendar } setCalendar={ setCalendar } />
                                    { dtErrors && <ErrorMessage message={ dtErrors }/> }
                                </div>
                                {errors.password && <ErrorMessage message={errors.password?.message} />}
                            </div>
                        </div>
                        
                        <div class="col">
                            <div style={{whiteSpace : 'nowrap'}}>
                                <label className="form-label mt-2 mb-1 fw-bold">Session Price</label>
                                &nbsp;
                                <text>${ coach.profileAsCoach.sessionPrice }</text>
                            </div>
                            <div style={{whiteSpace : 'nowrap'}}>
                                <label className="form-label mt-2 mb-1 fw-bold">Duration</label>
                                &nbsp;
                                <text>{ coach.profileAsCoach.sessionDuration } mins</text>
                            </div>
                        </div>
                    </div>
                    <div class="row px-4 mt-3">
                        <div class="col">
                            
                            <div class="row mb-3">
                                <label className="form-label mt-2 mb-1 fw-bold">Session Location</label>
                                <div className='text-wrap'>
                                    <text>{ coach.profileAsCoach.location }</text>
                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <input type="submit" value="Checkout" className="form-control btn btn-dark mt-4"/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Bookings;