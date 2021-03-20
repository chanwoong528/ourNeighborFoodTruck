//점주 로그인 
import React, { useState } from 'react';

import { HashRouter as Router, Route, Switch } from "react-router-dom";

import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Front from "../routes/Front";

// login -> 점주 -> auth-> profile 
// login x -> 일반유저 -> home(지도 내위치 기반 가까운 푸드트럭)
//로그인-> can Access Profile
//낫 로그인 -> can Access to auth, home Profile
const AppRouter = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <Router>
            <Switch>
                {isLoggedIn === false ? (
                    <>
                        <Route exact path="/">
                            <Front>
                            </Front>
                        </Route>
                        <Route exact path="/auth">
                            <Auth />
                        </Route>
                        <Route exact path="/home">
                            <Home />
                        </Route>


                    </>
                ) : (
                    <>
                        <Route exact path="/">
                            <Profile />
                        </Route>
                    </>
                )}
            </Switch>
        </Router>
    );
};
export default AppRouter;