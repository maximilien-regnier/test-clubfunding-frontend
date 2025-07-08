import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useHistory } from 'react-router-dom';
import { fetchTasksByProject, deleteTask, clearError as clearTaskError } from '../store/slices/tasksSlice';
import { deleteProject, fetchProjectById } from '../store/slices/projectsSlice';
import TasksFilters from '../components/TasksFilters';
import TasksPagination from '../components/TasksPagination';
import TaskCard from '../components/TaskCard';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';

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
      <PageHeader
        title={project.name}
        subtitle={`Créé le ${formatDate(project.created_at)}`}
        backLink="/projects"
        backText="Retour aux projets"
        actions={[
          {
            text: 'Modifier le projet',
            link: `/projects/${id}/edit`,
            primary: true
          },
          {
            text: 'Supprimer le projet',
            onClick: handleDeleteProject,
            loading: deletingProject,
            className: 'btn-error btn-outline'
          }
        ]}
      />

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
              <LoadingSpinner size="lg" />
            </div>
          ) : tasks.length === 0 ? (
            <EmptyState
              title="Aucune tâche"
              message="Ce projet ne contient aucune tâche pour le moment."
              actionText="Créer une tâche"
              actionLink={`/tasks/new?project_id=${id}`}
              icon="📝"
            />
          ) : (
            <div className="space-y-3">
              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={handleDeleteTask}
                  formatDate={formatDate}
                  deleting={deletingTask}
                />
              ))}
            </div>
          )}

          <TasksPagination onPageChange={handlePageChange} />
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteTask}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer la tâche "${taskToDelete?.title}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        loading={deletingTask}
      />

      <ConfirmModal
        isOpen={showProjectDeleteModal}
        onClose={() => setShowProjectDeleteModal(false)}
        onConfirm={confirmDeleteProject}
        title="Confirmer la suppression du projet"
        message={`Êtes-vous sûr de vouloir supprimer le projet "${project?.name}" ? Toutes les tâches associées seront également supprimées. Cette action est irréversible.`}
        confirmText="Supprimer le projet"
        loading={deletingProject}
      />
    </div>
  );
};

export default ProjectDetails;
