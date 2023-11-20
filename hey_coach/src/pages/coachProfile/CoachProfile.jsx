import { Fragment } from "react";
import { useParams, useNavigate } from "react-router";
import ListingCard from "../../components/listingCard/ListingCard"
import SocialMediaCard from "../../components/socialMedia/SocialMediaCard";
import ReviewComments from "../../components/reviewComments/ReviewComments";

function CoachProfile() {
    const params = useParams();
    // console.log(params.coachId);

    const navigate = useNavigate();
    return (
        <Fragment>
            <div className="container-xxl bd-gutter">
                <ListingCard buttonDesc="Schedule a Session" buttonAction={() => navigate("/bookings")}/>
                <hr></hr>
                <h3 className="fw-semibold my-4">Social Feed</h3>
                <div className="container">
                    <div className="row">
                        <SocialMediaCard />
                        <SocialMediaCard />
                        <SocialMediaCard />
                        <SocialMediaCard />
                    </div>
                </div>

                <h3 className="fw-semibold mt-4">What Others Say</h3>
                <div className="container">
                    <ReviewComments />
                    <ReviewComments />
                    <ReviewComments />
                    <ReviewComments />
                </div>
            </div>
        </Fragment>
    );
}

export default CoachProfile;