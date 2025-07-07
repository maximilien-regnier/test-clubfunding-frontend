import { useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';

const TasksFilters = ({ onFiltersChange }) => {
  const { filters } = useSelector(state => state.tasks);
  const [localSearch, setLocalSearch] = useState(filters.title || '');
  const debounceRef = useRef(null);

  useEffect(() => {
    setLocalSearch(filters.title || '');
  }, [filters.title]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      const newFilters = { ...filters, title: value };
      onFiltersChange(newFilters);
    }, 500);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    const newFilters = { ...filters, [name]: newValue };
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    setLocalSearch('');
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    const resetFiltersData = {
      title: '',
      sort_by: 'created_at',
      sort_order: 'desc',
      status: ''
    };
    onFiltersChange(resetFiltersData);
  };

  return (
    <div className="card bg-base-100 shadow-sm mb-6">
      <div className="card-body p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Rechercher</span>
            </label>
            <input
              type="text"
              name="title"
              value={localSearch}
              onChange={handleSearchChange}
              className="input input-bordered input-sm"
              placeholder="Titre de la tâche..."
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Statut</span>
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleInputChange}
              className="select select-bordered select-sm"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="completed">Terminé</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Trier par</span>
            </label>
            <select
              name="sort_by"
              value={filters.sort_by}
              onChange={handleInputChange}
              className="select select-bordered select-sm"
            >
              <option value="title">Titre</option>
              <option value="status">Statut</option>
              <option value="created_at">Date de création</option>
              <option value="updated_at">Dernière modification</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Ordre</span>
            </label>
            <select
              name="sort_order"
              value={filters.sort_order}
              onChange={handleInputChange}
              className="select select-bordered select-sm"
            >
              <option value="asc">Croissant</option>
              <option value="desc">Décroissant</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Actions</span>
            </label>
            <button
              onClick={handleReset}
              className="btn btn-outline btn-sm"
            >
              Réinitialiser
            </button>
          </div>
        </div>


      </div>
    </div>
  );
};

export default TasksFilters;
