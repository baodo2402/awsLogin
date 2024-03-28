import React from 'react';
import './index.css'
import Logo from './image/cleanntidyLogo.png';
import background from './image/home-img.png'

const Home = () => {

    return (
        <div>
            <section className='logo' style={{margin: "5% auto", textAlign: 'center', top: '10em'}}>
                <img src={Logo}
                style={{ width: '5em', height: '5em', objectFit: 'cover', marginTop: '4em'
                // position: 'absolute',
                // top: '10em',
                // left: '10em'
                
                }} />
            </section>
            
            <section style={{ textAlign: 'center',
                                margin: '0 auto',
                              width: '21em'
                            }}>
                <h1 className='home-title'>Clean 'n' Tidy <br /> Property Services</h1>
            </section>
            {/* <img src={background} className='home-image' /> */}
            
        </div>
    )
}

export default Home;