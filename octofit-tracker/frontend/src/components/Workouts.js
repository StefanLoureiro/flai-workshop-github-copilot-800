import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/';

  useEffect(() => {
    console.log('Workouts: fetching from', apiUrl);
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log('Workouts: fetched data', data);
        const records = Array.isArray(data) ? data : data.results || [];
        setWorkouts(records);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Workouts: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  return (
    <div className="card octofit-card">
      <div className="card-header d-flex align-items-center gap-2">
        <span>💪</span> Workouts
      </div>
      <div className="card-body p-0">
        {error && (
          <div className="alert alert-danger octofit-alert m-3">{error}</div>
        )}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-striped octofit-table mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Duration (min)</th>
                </tr>
              </thead>
              <tbody>
                {workouts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">No workouts found.</td>
                  </tr>
                ) : (
                  workouts.map((workout, idx) => (
                    <tr key={workout.id}>
                      <td className="text-muted">{idx + 1}</td>
                      <td><strong>{workout.name}</strong></td>
                      <td className="text-muted">{workout.description}</td>
                      <td>
                        <span className="badge bg-info text-dark">{workout.duration} min</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="card-footer text-muted small">
        {workouts.length} workout{workouts.length !== 1 ? 's' : ''} &mdash; <span className="font-monospace">{apiUrl}</span>
      </div>
    </div>
  );
}

export default Workouts;
