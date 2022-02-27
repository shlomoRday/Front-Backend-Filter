import React from "react";
import Headr from "./components/Headr.component";
import Nav from "./components/Nav.component";
import "./App.css";
import AppRouter from "./routers/AppRouter";

function App() {
  return (
    <div className="app">
      <Headr />
      <div className="container-fluid">
        <div className="row">
          <Nav />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <AppRouter />
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
