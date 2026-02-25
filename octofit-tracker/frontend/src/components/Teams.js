import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/';

  useEffect(() => {
    console.log('Teams: fetching from', apiUrl);
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log('Teams: fetched data', data);
        const records = Array.isArray(data) ? data : data.results || [];
        setTeams(records);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Teams: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  return (
    <div className="card octofit-card">
      <div className="card-header d-flex align-items-center gap-2">
        <span>🏆</span> Teams
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
                  <th>Team Name</th>
                  <th>Members</th>
                </tr>
              </thead>
              <tbody>
                {teams.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center text-muted py-4">No teams found.</td>
                  </tr>
                ) : (
                  teams.map((team, idx) => (
                    <tr key={team.id}>
                      <td className="text-muted">{idx + 1}</td>
                      <td><strong>{team.name}</strong></td>
                      <td>
                        {Array.isArray(team.members) && team.members.length > 0
                          ? team.members.map((m, i) => (
                              <span key={i} className="badge bg-secondary me-1">{m}</span>
                            ))
                          : <span className="text-muted">—</span>}
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
        {teams.length} team{teams.length !== 1 ? 's' : ''} &mdash; <span className="font-monospace">{apiUrl}</span>
      </div>
    </div>
  );
}

export default Teams;
