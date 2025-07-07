import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useHistory } from 'react-router-dom';
import { fetchTasksByProject, deleteTask, clearError as clearTaskError } from '../store/slices/tasksSlice';
import { deleteProject, fetchProjectById } from '../store/slices/projectsSlice';
import TasksFilters from '../components/TasksFilters';
import TasksPagination from '../components/TasksPagination';

const ProjectDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showProjectDeleteModal, setShowProjectDeleteModal] = useState(false);


  const { items: projects, deleting: deletingProject } = useSelector(state => state.projects);
  const { items: tasks, loading: loadingTasks, error: tasksError, deleting: deletingTask } = useSelector(state => state.tasks);

  const project = projects.find(p => p.id === parseInt(id));



  useEffect(() => {
    if (id) {
      if (!project) {
        dispatch(fetchProjectById(id));
      }
      dispatch(fetchTasksByProject({ projectId: id }));
    }
  }, [dispatch, id, project]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete) {
      await dispatch(deleteTask(taskToDelete.id));
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };

  const handleDeleteProject = () => {
    setShowProjectDeleteModal(true);
  };

  const confirmDeleteProject = async () => {
    await dispatch(deleteProject(id));
    setShowProjectDeleteModal(false);
    history.push('/projects');
  };

  const handleTaskClearError = () => {
    dispatch(clearTaskError());
  };

  const handleFiltersChange = (newFilters) => {
    const params = {
      ...newFilters,
      page: 1
    };
    
    Object.keys(params).forEach(key => {
      if (!params[key] || params[key] === '' || params[key] === false) {
        delete params[key];
      }
    });
    
    dispatch(fetchTasksByProject({ projectId: id, params }));
  };

  const handlePageChange = (page, perPage = null) => {
    const params = {};
    if (page) params.page = page;
    if (perPage) params.per_page = perPage;
    
    dispatch(fetchTasksByProject({ projectId: id, params }));
  };

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;

  if (!project) {
    return (
      <div className="alert alert-warning">
        <span>Projet non trouvé</span>
        <Link to="/projects" className="btn btn-sm">Retour aux projets</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="hero bg-base-200 rounded-lg">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold">{project.name}</h1>
            <p className="py-6">
              Créé le {formatDate(project.created_at)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={`/projects/${id}/edit`} className="btn btn-primary">
                Modifier le projet
              </Link>
              <button 
                className="btn btn-error btn-outline"
                onClick={handleDeleteProject}
                disabled={deletingProject}
              >
                {deletingProject ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  'Supprimer le projet'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-title">Total des tâches</div>
          <div className="stat-value text-primary">{tasks.length}</div>
        </div>
        
        <div className="stat">
          <div className="stat-title">Terminées</div>
          <div className="stat-value text-secondary">{completedTasks}</div>
        </div>
        
        <div className="stat">
          <div className="stat-title">En cours</div>
          <div className="stat-value text-accent">{pendingTasks}</div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Tâches du projet</h2>
            <Link to={`/tasks/new?project_id=${id}`} className="btn btn-primary">
              Nouvelle tâche
            </Link>
          </div>

          <TasksFilters onFiltersChange={handleFiltersChange} />

          {tasksError && (
            <div className="alert alert-error mb-4">
              <span>Erreur lors du chargement des tâches: {tasksError}</span>
              <button 
                className="btn btn-sm" 
                onClick={handleTaskClearError}
              >
                Fermer
              </button>
            </div>
          )}

          {loadingTasks ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : tasks.length === 0 ? (
            <div className="mockup-window border bg-base-300">
              <div className="flex justify-center px-4 py-16 bg-base-200">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Aucune tâche</h3>
                  <p className="text-base-content/70 mb-4">
                    Ce projet ne contient aucune tâche pour le moment.
                  </p>
                  <Link to={`/tasks/new?project_id=${id}`} className="btn btn-primary">
                    Créer une tâche
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="card bg-base-200 shadow-sm">
                  <div className="card-body p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">{task.title}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <div className={`badge ${task.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                            {task.status === 'completed' ? 'Terminée' : 'En cours'}
                          </div>
                          <span className="text-sm text-base-content/70">
                            Créée le {formatDate(task.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="join">
                        <Link 
                          to={`/tasks/${task.id}/edit`} 
                          className="btn btn-sm join-item"
                        >
                          Modifier
                        </Link>
                        <button 
                          className="btn btn-sm btn-error join-item"
                          onClick={() => handleDeleteTask(task)}
                          disabled={deletingTask}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <TasksPagination onPageChange={handlePageChange} />
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirmer la suppression</h3>
            <p className="py-4">
              Êtes-vous sûr de vouloir supprimer la tâche "{taskToDelete?.title}" ?
              Cette action est irréversible.
            </p>
            <div className="modal-action">
              <button 
                className="btn btn-error"
                onClick={confirmDeleteTask}
                disabled={deletingTask}
              >
                {deletingTask ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  'Supprimer'
                )}
              </button>
              <button 
                className="btn"
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingTask}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {showProjectDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirmer la suppression du projet</h3>
            <p className="py-4">
              Êtes-vous sûr de vouloir supprimer le projet "{project.name}" ?
              Toutes les tâches associées seront également supprimées.
              Cette action est irréversible.
            </p>
            <div className="modal-action">
              <button 
                className="btn btn-error"
                onClick={confirmDeleteProject}
                disabled={deletingProject}
              >
                {deletingProject ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  'Supprimer le projet'
                )}
              </button>
              <button 
                className="btn"
                onClick={() => setShowProjectDeleteModal(false)}
                disabled={deletingProject}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
