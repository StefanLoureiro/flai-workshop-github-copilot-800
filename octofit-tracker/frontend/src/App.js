import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import logo from './octofitapp-small.png';
import Users from './components/Users';
import Teams from './components/Teams';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';

const features = [
  { to: '/users',      icon: '👤', title: 'Users',       desc: 'Manage user profiles and accounts.' },
  { to: '/teams',      icon: '🏆', title: 'Teams',       desc: 'Create and manage fitness teams.' },
  { to: '/activities', icon: '🏃', title: 'Activities',  desc: 'Log and track your workouts.' },
  { to: '/leaderboard',icon: '📊', title: 'Leaderboard', desc: 'See who is leading the pack.' },
  { to: '/workouts',   icon: '💪', title: 'Workouts',    desc: 'Browse personalised workout plans.' },
];

function Home() {
  return (
    <div>
      <div className="octofit-hero text-center">
        <img src={logo} alt="OctoFit Tracker" className="octofit-hero-logo mb-3" />
        <h1>OctoFit Tracker</h1>
        <p className="mb-0">Your all-in-one fitness tracking platform — log activities, challenge teams, and climb the leaderboard.</p>
      </div>
      <div className="row g-4">
        {features.map((f) => (
          <div key={f.to} className="col-12 col-sm-6 col-lg-4">
            <NavLink to={f.to} className="text-decoration-none">
              <div className="card octofit-feature-card h-100 p-3">
                <div className="card-body text-center">
                  <div style={{ fontSize: '2.5rem' }}>{f.icon}</div>
                  <h5 className="card-title mt-2">{f.title}</h5>
                  <p className="card-text text-muted">{f.desc}</p>
                </div>
              </div>
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg octofit-navbar">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            <img src={logo} alt="OctoFit logo" />
            OctoFit Tracker
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {features.map((f) => (
                <li key={f.to} className="nav-item">
                  <NavLink className="nav-link" to={f.to}>
                    {f.icon} {f.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
