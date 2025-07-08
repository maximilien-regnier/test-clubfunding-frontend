import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProjects, clearError } from '../store/slices/projectsSlice';
import ProjectsFilters from '../components/ProjectsFilters';
import Pagination from '../components/Pagination';
import ProjectCard from '../components/ProjectCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

const ProjectsList = () => {
  const dispatch = useDispatch();
  const { items: projects, loading, error, filters, pagination } = useSelector(state => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const handleFiltersChange = (newFilters) => {
    const params = {
      ...filters,
      ...newFilters,
      page: 1,
      per_page: pagination.per_page
    };
    
    Object.keys(params).forEach(key => {
      if (!params[key] || params[key] === '') {
        delete params[key];
      }
    });
    
    dispatch(fetchProjects(params));
  };

  const handlePageChange = (page, perPage = null) => {
    const params = {
      ...filters,
      page: page || pagination.current_page,
      per_page: perPage || pagination.per_page
    };
    
    Object.keys(params).forEach(key => {
      if (!params[key] || params[key] === '') {
        delete params[key];
      }
    });
    
    dispatch(fetchProjects(params));
  };



  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Erreur lors du chargement des projets: {error}</span>
        <div>
          <button className="btn btn-sm" onClick={handleClearError}>Réessayer</button>
        </div>
      </div>
    );
  }


  return (
    <div>
      {/* Header */}
      <div className="hero bg-base-100 rounded-box mb-8">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Mes Projets</h1>
            <p className="py-6">
              Gérez vos projets et suivez l'avancement de vos tâches
            </p>
            <Link to="/projects/new" className="btn btn-primary btn-lg">
              Nouveau Projet
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <ProjectsFilters onFiltersChange={handleFiltersChange} />
      
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-4">
          <LoadingSpinner size="md" className="mr-2" />
          <span className="text-sm text-base-content/70">Chargement...</span>
        </div>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <EmptyState
          title="Aucun projet"
          message="Commencez par créer votre premier projet pour organiser vos tâches"
          actionText="Créer un projet"
          actionLink="/projects/new"
          icon="📁"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              formatDate={formatDate} 
            />
          ))}
        </div>
      )}
      
      {/* Pagination */}
      <Pagination onPageChange={handlePageChange} />
    </div>
  );
};

export default ProjectsList;
