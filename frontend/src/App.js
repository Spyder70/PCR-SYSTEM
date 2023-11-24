import React, { Component } from "react"
import { Router, Route } from "react-router-dom"
import { createBrowserHistory } from "history"
import Routes from "./Routes"
import "./tailwind-generated.css"
import 'animate.css'
// This are for custom notification
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Feedback from './views/Feedback' // Import the Feedback component

const browserHistory = createBrowserHistory()

export default class App extends Component {
  render() {
    return (
    <Router history={browserHistory}>
      <Routes />
      <Route exact path='Feedback' element={<Feedback />} /> {/* Route For the Feedback */}
      <ToastContainer />
    </Router>
    )
  }
}
