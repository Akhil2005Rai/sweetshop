import React, { useState, useEffect } from 'react';
import "./home.css";
import TextType from "./components/TextType.jsx";
import logo from "../assets/logo.png";
import HomeEle from './sub-pages/homepage.jsx';
import Browse from './sub-pages/browse.jsx';
import Cart from './sub-pages/cart.jsx';
import Profile from './sub-pages/profile.jsx';


const HomePage = () => {
    const [loading, setLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const [arr, setArr] = useState([<HomeEle />, <Browse/> , <Cart/>, <Profile/>]);

    const [screen,setScreen] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setFadeOut(true), 2000);
        const removeTimer = setTimeout(() => setLoading(false), 3000);

        return () => {
            clearTimeout(timer);
            clearTimeout(removeTimer);
        };
    }, []);

    return (
        <>
        
            {loading ? (
                <div className={`loader ${fadeOut ? 'fade-out' : ''}`}>
                    <div className="logo">
                        <img src={logo} alt="" className='logo'/>
                    </div>
                    <div className="name">
                        <TextType 
                            text={"Dessert Junction"}
                            typingSpeed={100}
                            pauseDuration={1500}
                            showCursor={true}
                            cursorCharacter=""
                        />
                        <TextType 
                            text={"Sweets."}
                            typingSpeed={100}
                            pauseDuration={1500}
                            showCursor={true}
                            cursorCharacter=""
                        />
                    </div>
                </div>
            ) : (
                <div className="holder">
                    <div className="navbar">
                        <div className="nleft">
                            <img src={logo} alt="" srcset="" className='nlogo'/>  
                            <div className="nmain">
                                <div className="nname">
                                    Dessert Junction Sweets
                                </div>
                                <div className="nslogan">
                                    Rishton ki meethi shuruaat
                                </div>
                                </div>                          
                        </div>
                        <div className="nright">
                            <div className="nopts" onClick={()=>{
                                setScreen(0)
                            }}>Home</div>
                            <div className="nopts" onClick={()=>{
                                setScreen(1)
                            }}>Browse</div>
                            <div className="nopts" onClick={()=>{
                                setScreen(2)
                            }}>Cart</div>
                            <div className="nopts" onClick={()=>{
                                setScreen(3)
                            }}>Profile</div>
                        </div>
                    </div>
                        <div className="body">
                            {arr[screen]}
                        </div>
                </div>
            )}
        </>
    );
}

export default HomePage;
