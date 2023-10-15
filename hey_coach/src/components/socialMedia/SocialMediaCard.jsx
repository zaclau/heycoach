function SocialMediaCard() {
    return (
        <div className="p-2 w-25">
            <div className="card text-bg-light">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/ErfgoedLeiden_LEI001015553_Gymnastiekzaal_van_de_Gymnastiekschool_aan_de_Pieterskerkgracht_in_Leiden.jpeg/176px-ErfgoedLeiden_LEI001015553_Gymnastiekzaal_van_de_Gymnastiekschool_aan_de_Pieterskerkgracht_in_Leiden.jpeg" className="card-img-top object-fit-cover" style={{height:"200px"}} />
                <div className="card-body">
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <p className="card-text">Tags here</p>
                    <div className="row">
                        <div className="col-2">
                            <img className="rounded-circle shadow ratio ratio-1x1" src="https://img.fruugo.com/product/5/43/182887435_max.jpg"></img>
                        </div>
                        <span className="col-5 text-nowrap overflow-hidden fs-6 px-0 fw-semibold">Nathan</span>
                        <span className="col-5 text-nowrap text-secondary fs-6 pe-2 fw-light overflow-x-hidden">16 Sept 2023</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SocialMediaCard;