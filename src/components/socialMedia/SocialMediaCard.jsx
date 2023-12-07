import React from 'react';
function SocialMediaCard({ key, url, mediaType, caption, timestamp, username, permalink, profilePic=null }) {
    const tsOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }
    return (
        <div className="p-2 w-25">
            <div className="card text-bg-light">
                <img src={url} className="card-img-top object-fit-cover" style={{height:"200px"}} />
                <div className="card-body">
                    <p className="card-text overflow-hidden" style={{height: "4.9rem"}}>{ caption }</p>
                    {/* <p className="card-text">Tags here</p> */}
                    <div className="row">
                        {profilePic && 
                            <div className="col-3 d-flex align-items-center">
                                <img className="rounded-circle shadow ratio ratio-1x1" src={img}></img>
                            </div>
                        }
                        <div className={profilePic ? 'col-7' : 'col-10 ps-4'}>
                            <div className="row">
                                <div className="col ps-0 text-nowrap overflow-hidden">
                                    <span className="fs-6 px-0 fw-semibold">{ username }</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col ps-0 text-nowrap overflow-hidden">
                                    <span className="text-secondary fs-6 pe-2 fw-light overflow-x-hidden">{ new Date(timestamp).toLocaleDateString({options: tsOptions}) }</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-2 ps-0 d-flex align-items-center">
                            <a href={ permalink } rel='noopener noreferrer' target='_blank'>
                                <i className="bi bi-box-arrow-up-right link-secondary"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SocialMediaCard;