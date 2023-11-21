import React from 'react';
import { useForm } from "react-hook-form"
import ListingCard from "../../components/listingCard/ListingCard"
import ErrorMessage from "../../components/errorMessage/ErrorMessage";
import CalendarPicker from "../../components/calendarpicker/CalendarPicker";
import "./bookings.css"

function Bookings() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    return (
        <div className="container-xxl bd-gutter">
            <ListingCard />
            <div className="booking-form">
                <form onSubmit={handleSubmit((data) => {
                        console.log(data)   // TODO: Replace with backend call to login endpoint
                    })} className="col-12">

                    <div class="row px-4">
                        <div class="col">
                            <label className="form-label mt-2 mb-1 fw-bold">Session Duration</label>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="reverseCheck1"/>
                                <label class="form-check-label" for="reverseCheck1">
                                    Basic Sweat (30 mins)
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="reverseCheck2"/>
                                <label class="form-check-label" for="reverseCheck2">
                                    Full Burn (60 mins)
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="reverseCheck3"/>
                                <label class="form-check-label" for="reverseCheck3">
                                    Power to the MAX (90 mins)
                                </label>
                            </div>
                            {errors.duration && <ErrorMessage message={errors.duration?.message} />}
                        </div>
                        <div class="col">
                            <div style={{whiteSpace : 'nowrap'}}>
                                <label className="form-label mt-2 mb-1 fw-bold">Session Price</label>
                                &nbsp;
                                <text>$XXX</text>
                            </div>
                            <div style={{whiteSpace : 'nowrap'}}>
                                <label className="form-label mt-2 mb-1 fw-bold">Duration</label>
                                &nbsp;
                                <text>60 mins</text>
                            </div>
                            <div style={{whiteSpace : 'nowrap'}}>
                                <label className="form-label mt-2 mb-1 fw-bold">Total</label>
                                &nbsp;
                                <text>$XXX</text>
                            </div>
                        </div>
                    </div>
                    <div class="row px-4 mt-3">
                        <div class="col">
                            <div class="row mb-3">
                                <label className="form-label mt-2 mb-1 fw-bold">Session Date & Time</label>
                                <div class="col-7" id="calendar">
                                    <CalendarPicker />
                                </div>
                                {errors.password && <ErrorMessage message={errors.password?.message} />}
                            </div>
                            <div class="row mb-3">
                                <label className="form-label mt-2 mb-1 fw-bold">Session Location</label>
                                <div>
                                    <div style={{whiteSpace : 'nowrap'}}>
                                        <label for="loc1">Unit</label>
                                        &nbsp;
                                        <text>#08-405</text>
                                    </div>
                                    <div style={{whiteSpace : 'nowrap'}}>
                                        <label for="loc2">Building Name</label>
                                        &nbsp;
                                        <text>Fernavle Vista</text>
                                    </div>
                                    <div style={{whiteSpace : 'nowrap'}}>
                                        <label for="loc1">Street Name</label>
                                        &nbsp;
                                        <text>Jalan Kayu, Singapore</text>
                                    </div>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label for="messagetocoach" class="form-label fw-bold">Message to Coach</label>
                                <textarea class="form-control" id="messagetocoach" rows="3"></textarea>
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