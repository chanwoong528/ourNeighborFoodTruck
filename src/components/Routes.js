//점주 로그인
import React, { useState } from "react";

import { HashRouter as Router, Route, Switch } from "react-router-dom";

import App from "./App";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Front from "../routes/Front";

// login -> 점주 -> auth-> profile
// login x -> 일반유저 -> home(지도 내위치 기반 가까운 푸드트럭)
//로그인-> can Access Profile
//낫 로그인 -> can Access to auth, home Profile
const AppRouter = (props) => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Front isLoggedIn ={props.isLoggedIn}></Front>
        </Route>
        <Route exact path ="/home">
          <Home />
        </Route>
        {
          props.isLoggedIn === true ? (
          <>
            <Route exact path ={"/profile"|"/auth" }> {/*to rerender profile page when logged*/}
              <Profile/>
            </Route>
          </>
        ) : (
          <>
            <Route exact path="/auth">
              <Auth />
            </Route>
          </>
        )}
      </Switch>
    </Router>
  );
};
export default AppRouter;
