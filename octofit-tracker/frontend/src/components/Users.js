import React, { useState, useEffect, useCallback } from 'react';

const BASE_URL = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

const USERS_URL  = `${BASE_URL}/api/users/`;
const TEAMS_URL  = `${BASE_URL}/api/teams/`;

/** Return the team that currently lists this user email as a member. */
function userTeam(email, teams) {
  return teams.find((t) => Array.isArray(t.members) && t.members.includes(email)) || null;
}

function Users() {
  const [users,       setUsers]       = useState([]);
  const [teams,       setTeams]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [saveError,   setSaveError]   = useState(null);
  const [saving,      setSaving]      = useState(false);
  const [editUser,    setEditUser]    = useState(null);   // user being edited
  const [form,        setForm]        = useState({});     // modal form state
  const [showModal,   setShowModal]   = useState(false);

  /* ── fetch helpers ── */
  const fetchAll = useCallback(() => {
    setLoading(true);
    console.log('Users: fetching from', USERS_URL);
    console.log('Teams: fetching from', TEAMS_URL);
    Promise.all([
      fetch(USERS_URL).then((r) => r.json()),
      fetch(TEAMS_URL).then((r) => r.json()),
    ])
      .then(([uData, tData]) => {
        console.log('Users: fetched data', uData);
        console.log('Teams: fetched data', tData);
        setUsers(Array.isArray(uData) ? uData : uData.results || []);
        setTeams(Array.isArray(tData) ? tData : tData.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Users: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── open modal ── */
  function openEdit(user) {
    const currentTeam = userTeam(user.email, teams);
    setEditUser(user);
    setForm({
      name:     user.name,
      email:    user.email,
      password: '',
      teamId:   currentTeam ? String(currentTeam.id) : '',
    });
    setSaveError(null);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditUser(null);
  }

  /* ── save ── */
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      /* 1. PATCH user personal details */
      const userPatch = { name: form.name, email: form.email };
      if (form.password.trim()) userPatch.password = form.password;

      const userRes = await fetch(`${USERS_URL}${editUser.id}/`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(userPatch),
      });
      if (!userRes.ok) {
        const errBody = await userRes.text();
        throw new Error(`User update failed (${userRes.status}): ${errBody}`);
      }

      /* 2. Update team membership */
      const oldTeam = userTeam(editUser.email, teams);
      const newTeamId = form.teamId;

      // Remove from old team if changing or clearing
      if (oldTeam && String(oldTeam.id) !== newTeamId) {
        const updatedMembers = oldTeam.members.filter((m) => m !== editUser.email);
        const res = await fetch(`${TEAMS_URL}${oldTeam.id}/`, {
          method:  'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ members: updatedMembers }),
        });
        if (!res.ok) throw new Error(`Team update failed (${res.status})`);
      }

      // Add to new team (if selected and different from old)
      if (newTeamId && (!oldTeam || String(oldTeam.id) !== newTeamId)) {
        const newTeam = teams.find((t) => String(t.id) === newTeamId);
        if (newTeam) {
          const targetEmail = form.email; // use new email in case it changed
          const updatedMembers = newTeam.members.includes(targetEmail)
            ? newTeam.members
            : [...newTeam.members, targetEmail];
          const res = await fetch(`${TEAMS_URL}${newTeam.id}/`, {
            method:  'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ members: updatedMembers }),
          });
          if (!res.ok) throw new Error(`Team update failed (${res.status})`);
        }
      }

      setSaving(false);
      closeModal();
      fetchAll();   // refresh table
    } catch (err) {
      console.error('Save error', err);
      setSaveError(err.message);
      setSaving(false);
    }
  }

  /* ── render ── */
  return (
    <>
      <div className="card octofit-card">
        <div className="card-header d-flex align-items-center gap-2">
          <span>👤</span> Users
        </div>
        <div className="card-body p-0">
          {error && (
            <div className="alert alert-danger octofit-alert m-3">{error}</div>
          )}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading…</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-striped octofit-table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Team</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">No users found.</td>
                    </tr>
                  ) : (
                    users.map((user, idx) => {
                      const team = userTeam(user.email, teams);
                      return (
                        <tr key={user.id}>
                          <td className="text-muted">{idx + 1}</td>
                          <td><strong>{user.name}</strong></td>
                          <td>
                            <a href={`mailto:${user.email}`} className="text-decoration-none">{user.email}</a>
                          </td>
                          <td>
                            {team
                              ? <span className="badge bg-secondary">{team.name}</span>
                              : <span className="text-muted">—</span>}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openEdit(user)}
                            >
                              ✏️ Edit
                            </button>
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
          {users.length} user{users.length !== 1 ? 's' : ''} &mdash; <span className="font-monospace">{USERS_URL}</span>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <form onSubmit={handleSave}>
                  <div className="modal-header" style={{ background: 'linear-gradient(135deg,#0f3460,#0d1b2a)', color: '#90e0ef' }}>
                    <h5 className="modal-title">✏️ Edit User</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={closeModal} aria-label="Close" />
                  </div>

                  <div className="modal-body">
                    {saveError && (
                      <div className="alert alert-danger octofit-alert">{saveError}</div>
                    )}

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Password <span className="text-muted fw-normal">(leave blank to keep unchanged)</span>
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="New password…"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                      />
                    </div>

                    <div className="mb-1">
                      <label className="form-label fw-semibold">Team</label>
                      <select
                        className="form-select"
                        value={form.teamId}
                        onChange={(e) => setForm({ ...form, teamId: e.target.value })}
                      >
                        <option value="">— No team —</option>
                        {teams.map((t) => (
                          <option key={t.id} value={String(t.id)}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? (
                        <><span className="spinner-border spinner-border-sm me-2" role="status" />Saving…</>
                      ) : (
                        '💾 Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={closeModal} />
        </>
      )}
    </>
  );
}

export default Users;
