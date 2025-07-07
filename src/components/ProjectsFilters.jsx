import { useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';

const ProjectsFilters = ({ onFiltersChange }) => {
  const { filters } = useSelector(state => state.projects);
  const [localSearch, setLocalSearch] = useState(filters.name || '');
  const debounceRef = useRef(null);

  useEffect(() => {
    setLocalSearch(filters.name || '');
  }, [filters.name]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      const newFilters = { ...filters, name: value };
      onFiltersChange(newFilters);
    }, 500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    onFiltersChange(newFilters);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleReset = () => {
    setLocalSearch('');
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    const resetFiltersData = {
      name: '',
      sort_by: 'created_at',
      sort_order: 'desc',
      created_from: '',
      created_to: ''
    };
    onFiltersChange(resetFiltersData);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="card bg-base-100 shadow-sm mb-6">
      <div className="card-body p-4">
        <form onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Rechercher</span>
            </label>
            <input
              type="text"
              name="name"
              value={localSearch}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="input input-bordered input-sm"
              placeholder="Nom du projet..."
            />
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
              <option value="name">Nom</option>
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
              type="button"
              onClick={handleReset}
              className="btn btn-outline btn-sm"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Créé après le</span>
            </label>
            <input
              type="date"
              name="created_from"
              value={filters.created_from}
              onChange={handleInputChange}
              className="input input-bordered input-sm"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Créé avant le</span>
            </label>
            <input
              type="date"
              name="created_to"
              value={filters.created_to}
              onChange={handleInputChange}
              className="input input-bordered input-sm"
            />
          </div>
        </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectsFilters;
