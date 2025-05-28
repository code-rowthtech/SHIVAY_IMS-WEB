// @flow
import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// images
import { Logo, Shivay_Logo } from '../../helpers/image';

type AccountLayoutProps = {
    bottomLinks?: React$Element<any>,
    children?: any,
};

const AccountLayout = ({ bottomLinks, children }: AccountLayoutProps): React$Element<any> => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        if (document.body) document.body.classList.add('authentication-bg');

        return () => {
            if (document.body) document.body.classList.remove('authentication-bg');
        };
    }, []);

    return (
        <>
            <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5} xxl={4}>
                            <Card>
                                {/* logo */}
                                <Card.Header className=" text-center" style={{backgroundColor:'#6655D9'}} >
                                    <Link to="/">
                                        <span>
                                            <img src={Shivay_Logo} alt="" height="70" className='rounded-pill px-3' style={{backgroundColor:'#6655D9'}} />
                                        </span>
                                    </Link>
                                </Card.Header>
                                <Card.Body className="p-4">{children}</Card.Body>
                            </Card>

                            {/* bottom links */}
                            {bottomLinks}
                        </Col>
                    </Row>
                </Container>
            </div>
            <footer className="footer footer-alt">{currentYear} © SHIVAY - <a href="https://rowthtech.com/" className='text-muted'><u>rowthtech.com</u></a></footer>
        </>
    );
};

export default AccountLayout;
