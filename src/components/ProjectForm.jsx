import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FormField from './FormField';
import PageHeader from './PageHeader';
import { 
  createProject, 
  updateProject, 
  clearError,
  setFormData,
  setFormErrors,
  resetForm,
  initializeForm
} from '../store/slices/projectsSlice';

const ProjectForm = ({ project = null, isEdit = false }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { 
    creating, 
    updating, 
    error, 
    form: { data: formData, errors, isSubmitting } 
  } = useSelector(state => state.projects);

  const isLoading = creating || updating || isSubmitting;

  useEffect(() => {
    if (project && isEdit) {
      dispatch(initializeForm({
        name: project.name || ''
      }));
    } else {
      dispatch(resetForm());
    }
  }, [dispatch, project, isEdit]);

  useEffect(() => {
    return () => {
      dispatch(resetForm());
    };
  }, [dispatch]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du projet est requis';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Le nom du projet doit contenir au moins 3 caractères';
    } else if (formData.name.trim().length > 255) {
      newErrors.name = 'Le nom du projet ne peut pas dépasser 255 caractères';
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
      if (isEdit && project) {
        const result = await dispatch(updateProject({
          id: project.id,
          ...formData
        }));
        if (result.type.endsWith('/fulfilled')) {
          history.push(`/projects/${project.id}`);
        }
      } else {
        const result = await dispatch(createProject(formData));
        if (result.type.endsWith('/fulfilled')) {
          const newProject = result.payload.data || result.payload;
          history.push(`/projects/${newProject.id}`);
        }
      }
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handleCancel = () => {
    if (isEdit && project) {
      history.push(`/projects/${project.id}`);
    } else {
      history.push('/projects');
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title={isEdit ? 'Modifier le projet' : 'Nouveau projet'}
        subtitle={isEdit 
          ? 'Modifiez les informations de votre projet'
          : 'Créez un nouveau projet pour organiser vos tâches'
        }
        backLink={isEdit && project ? `/projects/${project.id}` : '/projects'}
      />

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
              label="Nom du projet"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              placeholder="Entrez le nom du projet"
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
                  isEdit ? 'Modifier le projet' : 'Créer le projet'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
