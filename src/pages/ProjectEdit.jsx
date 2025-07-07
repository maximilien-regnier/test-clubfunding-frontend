import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchProjectById } from '../store/slices/projectsSlice';
import ProjectForm from '../components/ProjectForm';

const ProjectEdit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { items: projects, loading } = useSelector(state => state.projects);
  
  const project = projects.find(p => p.id === parseInt(id));

  useEffect(() => {
    if (id && !project && !loading) {
      dispatch(fetchProjectById(id));
    }
  }, [dispatch, id, project, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="alert alert-warning">
        <span>Projet non trouvé</span>
      </div>
    );
  }

  return <ProjectForm project={project} isEdit={true} />;
};

export default ProjectEdit;
