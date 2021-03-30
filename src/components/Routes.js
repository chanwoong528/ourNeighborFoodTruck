//점주 로그인
import React from "react";

import { HashRouter as Router,  Route, Switch } from "react-router-dom";


import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Front from "../routes/Front";
import Navigation from "./Navigation";
import StoreDetail from "../routes/StoreDetail";
// login -> 점주 -> auth-> profile
// login x -> 일반유저 -> home(지도 내위치 기반d 가까운 푸드트럭)
//로그인-> can Access Profile
//낫 로그인 -> can Access to auth, home Profile
const AppRouter = (props) => {
  return (
    <Router>
      <Navigation isLoggedIn={props.isLoggedIn} />
     
      <Switch>
        <Route exact path="/">
          <Front isLoggedIn={props.isLoggedIn}/>
        </Route>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path ="/store/:id"children={ <StoreDetail/>} />
        
        {props.isLoggedIn ? (
          <>
            <Route exact path={"/profile"|"/auth"}>
            
              <Profile userObj={props.userObj} />
            </Route>
            
          </>
          
        ) : (
          <>
            <Route exact path={"/auth"|"/profile" }>
              <Auth />
            </Route>
            
          </>
        )}
        
      </Switch>
     
    </Router>
  );
};
export default AppRouter;