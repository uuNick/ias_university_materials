import React from 'react';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';


const MainPage = () => {
    return (
        <>
            <Header></Header>
            <div style={{margin: '100px', textAlign: 'center'}}>Основное содержимое</div>
            <Footer></Footer>
        </>
    );
};

export default MainPage;