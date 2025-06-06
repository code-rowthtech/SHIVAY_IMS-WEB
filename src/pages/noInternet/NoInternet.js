import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";
import { Shivay_Logo } from "../../helpers/image";
// import { baymetal } from "../img/images";
 
const NoInternet = () => {
    const isOnline = navigator.onLine;
 
    const handleConnectionCheck = () => {
        if (!isOnline) {
            console.log("You're still offline. Please reconnect to access full features.");
        } else {
            console.log("You're back online!");
        }
    };
 
    return (
        <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
            <div className="container">
                <Row className="justify-content-center">
                    <Col md={8} lg={6} xl={5} xxl={4}>
                        <Card className="shadow-sm">
                            {/* Logo Section */}
                            <Card.Header className="text-center py-3" style={{backgroundColor:'#00A0E3'}}>
                                <Link to="/">
                                    <img src={Shivay_Logo} alt="Logo" height="60" className="" />
                                </Link>
                                {/* <h5 className="text-white">Your Trusted Network App</h5> */}
                            </Card.Header>
 
                            <Card.Body className="p-4">
                                <div className="text-center">
                                    {/* Icon and Status */}
                                    <h1>
                                        <i
                                            className={`mdi ${isOnline ? "mdi-wifi text-primary" : "mdi-wifi-off text-danger"}`}
                                            style={{ fontSize: "4rem" }}
                                        ></i>
                                    </h1>
                                    <h4 className="text-uppercase mt-3">
                                        {isOnline ? (
                                            <span style={{color:'#00A0E3'}}>You're Back Online!</span>
                                        ) : (
                                            <span className="text-danger">No Internet Connection</span>
                                        )}
                                    </h4>
                                    {/* Descriptive Message */}
                                    <p className="text-muted mt-4">
                                        {isOnline
                                            ? "Hurray! Your internet connection is restored. Enjoy uninterrupted browsing."
                                            : "We couldn't detect an active internet connection. Please check your settings and try again."}
                                    </p>
 
                                    {/* Button */}
                                    <Link
                                        to="/"
                                        className={`btn btn-lg ${isOnline ? 'btn-success' : 'btn-primary'} mt-4 px-4`}
                                        onClick={handleConnectionCheck}
                                    >
                                        {isOnline ? (
                                            <>
                                                <i className="mdi mdi-arrow-left"></i> Continue browsing
                                            </>
                                        ) : (
                                            <>
                                                <i className="mdi mdi-refresh"></i> Retry Connecting
                                            </>
                                        )}
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
 
                        {/* Footer Message */}
                        <div className="text-center mt-4">
                            <p className="text-muted">
                                {isOnline
                                    ? "You're connected to a reliable network."
                                    : "Still no luck? Check your Wi-Fi or contact your ISP."}
                            </p>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};
 
export default NoInternet;