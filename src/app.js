import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavigationBar from "./navigation-bar";
import Home from "./home/home";
import UserContainer from "./user/user-container";
import WebSocketComponent from "./user/components/WebSocketComponent.js";
import DeviceContainer from "./device/device-container";
import ErrorPage from "./commons/errorhandling/error-page";
import styles from "./commons/styles/project-style.css";
import PrivateRoute from "./user/private-route.js";
import Profile from "./profile/profile.js";
import DeviceChart from "./device/device-chart.js";
import LoginWrapper from "./login/login-wrapper.js";

function App() {
  const renderRoute = (path, element, requiredRole = null) => (
    <Route
      path={path}
      element={
        requiredRole ? (
          <PrivateRoute requiredRole={requiredRole}>{element}</PrivateRoute>
        ) : (
          element
        )
      }
    />
  );

  return (
    <div className={styles.back}>
      <Router>
        <WebSocketComponent />
        <NavigationBar />
        <Routes>
          {renderRoute("/", <Home />, null)}
          {renderRoute("/user", <UserContainer />, "ADMIN")}
          {renderRoute("/device", <DeviceContainer />)}
          {renderRoute("/device-chart/:deviceId", <DeviceChart />)}
          {renderRoute("/login", <LoginWrapper />, null)}
          {renderRoute("/error", <ErrorPage />, null)}
          {renderRoute("/profile", <Profile />)}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
