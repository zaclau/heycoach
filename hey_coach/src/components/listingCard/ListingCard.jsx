const ListingCard = () => {
    return (
        // 2 columns: 1 for picture and pricing, 1 for details on the right
        <div className="container justify-content-center p-2">
            <div className="row">
                <div className="col-2">
                    <img
                        src="https://cf.bstatic.com/xdata/images/city/max500/690334.webp?k=b99df435f06a15a1568ddd5f55d239507c0156985577681ab91274f917af6dbb&o="
                        alt=""
                        className="featuredImg rounded img-fluid"
                    />
                    <h3>$XXX/session</h3>
                </div>
                <div className="col-5">
                    <h3>Name of Person</h3>
                    <p>profile blurb</p>
                    <p>long description of mentor</p>

                    <button className="btn btn-dark">View Profile</button>
                </div>
            </div>
        </div>
    )
}

export default ListingCard