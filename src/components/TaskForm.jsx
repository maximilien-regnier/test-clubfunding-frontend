import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import FormField from './FormField';
import PageHeader from './PageHeader';
import { 
  createTask, 
  updateTask, 
  clearError,
  setFormData,
  setFormErrors,
  resetForm,
  initializeForm
} from '../store/slices/tasksSlice';

const TaskForm = ({ task = null, isEdit = false }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const projectIdFromQuery = searchParams.get('project_id');
  
  const { 
    creating, 
    updating, 
    error, 
    form: { data: formData, errors, isSubmitting } 
  } = useSelector(state => state.tasks);

  const isLoading = creating || updating || isSubmitting;

  useEffect(() => {
    if (task && isEdit) {
      dispatch(initializeForm({
        title: task.title || '',
        status: task.status || 'pending',
        project_id: task.project_id
      }));
    } else {
      dispatch(resetForm());
      if (projectIdFromQuery) {
        dispatch(setFormData({ project_id: parseInt(projectIdFromQuery) }));
      }
    }
  }, [dispatch, task, isEdit, projectIdFromQuery]);

  useEffect(() => {
    return () => {
      dispatch(resetForm());
    };
  }, [dispatch]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre de la tâche est requis';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Le titre doit contenir au moins 3 caractères';
    } else if (formData.title.trim().length > 255) {
      newErrors.title = 'Le titre ne peut pas dépasser 255 caractères';
    }

    if (!formData.status) {
      newErrors.status = 'Le statut est requis';
    } else if (!['pending', 'completed'].includes(formData.status)) {
      newErrors.status = 'Le statut doit être "pending" ou "completed"';
    }

    if (!formData.project_id) {
      newErrors.project_id = 'Le projet est requis';
    }

    dispatch(setFormErrors(newErrors));
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormData({ [name]: value }));
    
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      dispatch(setFormErrors(newErrors));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isEdit && task) {
        const result = await dispatch(updateTask({
          id: task.id,
          ...formData
        }));
        if (result.type.endsWith('/fulfilled')) {
          history.push(`/projects/${formData.project_id}`);
        }
      } else {
        const result = await dispatch(createTask(formData));
        if (result.type.endsWith('/fulfilled')) {
          history.push(`/projects/${formData.project_id}`);
        }
      }
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handleCancel = () => {
    if (formData.project_id) {
      history.push(`/projects/${formData.project_id}`);
    } else {
      history.push('/projects');
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="hero bg-base-200 rounded-lg mb-6">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold">
              {isEdit ? 'Modifier la tâche' : 'Nouvelle tâche'}
            </h1>
            <p className="py-6">
              {isEdit 
                ? 'Modifiez les informations de votre tâche'
                : 'Créez une nouvelle tâche pour votre projet'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {error && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Erreur: {error}</span>
              <button className="btn btn-sm" onClick={handleClearError}>
                Fermer
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Titre de la tâche"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              error={errors.title}
              placeholder="Entrez le titre de la tâche"
              required
            />

            <FormField
              label="Statut"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              error={errors.status}
              options={[
                { value: 'pending', label: 'En attente' },
                { value: 'completed', label: 'Terminée' }
              ]}
              required
            />

            <div className="divider"></div>

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    {isEdit ? 'Modification...' : 'Création...'}
                  </>
                ) : (
                  isEdit ? 'Modifier la tâche' : 'Créer la tâche'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
