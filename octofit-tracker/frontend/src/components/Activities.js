import React, { useState, useEffect } from 'react';

const ACTIVITY_BADGES = {
  Running:   'bg-success',
  Cycling:   'bg-primary',
  Swimming:  'bg-info',
  Yoga:      'bg-warning text-dark',
  Hiking:    'bg-secondary',
};

/** Safely format a YYYY-MM-DD (or ISO datetime) string without timezone shift. */
function formatDate(raw) {
  if (!raw) return '—';
  // Extract just the date portion (handles both "2024-01-10" and "2024-01-10T00:00:00Z")
  const datePart = String(raw).split('T')[0];
  const match = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return raw; // return as-is if we can't parse
  const [, year, month, day] = match;
  // Build a local Date to avoid UTC shift
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function Activities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
    : 'http://localhost:8000/api/activities/';

  useEffect(() => {
    console.log('Activities: fetching from', apiUrl);
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log('Activities: fetched data', data);
        const records = Array.isArray(data) ? data : data.results || [];
        setActivities(records);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Activities: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  return (
    <div className="card octofit-card">
      <div className="card-header d-flex align-items-center gap-2">
        <span>🏃</span> Activities
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
                  <th>User</th>
                  <th>Activity Type</th>
                  <th>Duration (min)</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">No activities found.</td>
                  </tr>
                ) : (
                  activities.map((activity, idx) => (
                    <tr key={activity.id}>
                      <td className="text-muted">{idx + 1}</td>
                      <td><strong>{activity.user}</strong></td>
                      <td>
                        <span className={`badge ${ACTIVITY_BADGES[activity.activity_type] || 'bg-dark'}`}>
                          {activity.activity_type}
                        </span>
                      </td>
                      <td>{activity.duration}</td>
                      <td>{formatDate(activity.date)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="card-footer text-muted small">
        {activities.length} activit{activities.length !== 1 ? 'ies' : 'y'} &mdash; <span className="font-monospace">{apiUrl}</span>
      </div>
    </div>
  );
}

export default Activities;
