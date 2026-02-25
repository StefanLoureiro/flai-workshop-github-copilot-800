import React, { useState, useEffect } from 'react';

const RANK_STYLES = [
  { badge: 'bg-warning text-dark', label: '🥇 1st' },
  { badge: 'bg-secondary',         label: '🥈 2nd' },
  { badge: 'bg-danger',            label: '🥉 3rd' },
];

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
    : 'http://localhost:8000/api/leaderboard/';

  useEffect(() => {
    console.log('Leaderboard: fetching from', apiUrl);
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log('Leaderboard: fetched data', data);
        const records = Array.isArray(data) ? data : data.results || [];
        // Sort descending by score
        records.sort((a, b) => b.score - a.score);
        setLeaderboard(records);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Leaderboard: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  return (
    <div className="card octofit-card">
      <div className="card-header d-flex align-items-center gap-2">
        <span>📊</span> Leaderboard
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
                  <th>Rank</th>
                  <th>User</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center text-muted py-4">No entries found.</td>
                  </tr>
                ) : (
                  leaderboard.map((entry, idx) => {
                    const rank = RANK_STYLES[idx];
                    return (
                      <tr key={entry.id}>
                        <td>
                          {rank ? (
                            <span className={`badge badge-rank ${rank.badge}`}>{rank.label}</span>
                          ) : (
                            <span className="text-muted">{idx + 1}</span>
                          )}
                        </td>
                        <td><strong>{entry.user}</strong></td>
                        <td>
                          <span className="badge bg-primary fs-6">{entry.score}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="card-footer text-muted small">
        {leaderboard.length} entr{leaderboard.length !== 1 ? 'ies' : 'y'} &mdash; <span className="font-monospace">{apiUrl}</span>
      </div>
    </div>
  );
}

export default Leaderboard;
