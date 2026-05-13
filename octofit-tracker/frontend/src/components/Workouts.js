import React, { useState, useEffect } from 'react';

const Workouts = () => {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const codespaceEndpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
    : null;
  const baseApiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : 'http://localhost:8000/api';
  const endpoint = codespaceEndpoint || `${baseApiUrl}/workouts/`;
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const fetchWorkouts = () => {
    console.log('Fetching Workouts from', endpoint);
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log('Workouts fetched data:', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setWorkouts(items);
        setFilteredWorkouts(items);
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching workouts:', err);
        setError(err.message || 'Failed to fetch workouts');
      });
  };

  useEffect(() => {
    fetchWorkouts();
  }, [endpoint]);

  const handleSearch = (event) => {
    event.preventDefault();
    const term = query.trim().toLowerCase();
    const items = term
      ? workouts.filter((workout) =>
          [workout.user, workout.workout, String(workout.reps)]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(term)
        )
      : workouts;
    setFilteredWorkouts(items);
  };

  const openModal = (workout) => {
    setSelectedWorkout(workout);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedWorkout(null);
  };

  return (
    <div className="page-section">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
        <div>
          <h2 className="h3">Workouts</h2>
          <p className="text-muted mb-0">Endpoint: <span className="text-break">{endpoint}</span></p>
        </div>
        <button type="button" className="btn btn-outline-primary mt-3 mt-md-0" onClick={fetchWorkouts}>
          Refresh Workouts
        </button>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <form className="row g-2 align-items-center mb-4" onSubmit={handleSearch}>
            <div className="col-sm-8">
              <label htmlFor="workoutsSearch" className="form-label visually-hidden">
                Search Workouts
              </label>
              <input
                id="workoutsSearch"
                type="text"
                className="form-control"
                value={query}
                placeholder="Search user, workout, or reps"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="col-sm-4 d-grid">
              <button type="submit" className="btn btn-primary">
                Filter Workouts
              </button>
            </div>
          </form>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>User</th>
                  <th>Workout</th>
                  <th>Reps</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkouts.map((workout, idx) => (
                  <tr key={workout.id || idx}>
                    <td>{workout.user || '—'}</td>
                    <td>{workout.workout || '—'}</td>
                    <td>{workout.reps ?? '—'}</td>
                    <td className="text-end">
                      <button type="button" className="btn btn-sm btn-link" onClick={() => openModal(workout)}>
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && selectedWorkout && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Workout Details</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
              </div>
              <div className="modal-body">
                <pre className="bg-light p-3 rounded">{JSON.stringify(selectedWorkout, null, 2)}</pre>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </div>
      )}
    </div>
  );
};

export default Workouts;
