import { Link } from 'react-router-dom';

const ProjectCard = ({ project, formatDate }) => {
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
      <div className="card-body">
        <h2 className="card-title text-xl mb-4">{project.name}</h2>
        
        <div className="stats stats-vertical lg:stats-horizontal shadow-sm mb-4">
          <div className="stat">
            <div className="stat-title">Tâches</div>
            <div className="stat-value text-primary">{project.tasks.length || 0}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Créé</div>
            <div className="stat-value text-sm">{formatDate(project.created_at)}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Modifié</div>
            <div className="stat-value text-sm">{formatDate(project.updated_at)}</div>
          </div>
        </div>

        <div className="card-actions justify-end">
          <div className="join">
            <Link 
              to={`/projects/${project.id}/edit`} 
              className="btn btn-outline join-item"
            >
              Modifier
            </Link>
            <Link 
              to={`/projects/${project.id}`} 
              className="btn btn-primary join-item"
            >
              Détails
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
