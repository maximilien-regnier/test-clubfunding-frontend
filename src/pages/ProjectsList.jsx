import { Link } from 'react-router-dom';

const ProjectsList = () => {
  const projects = [
    {
      id: 1,
      name: "Site Web E-commerce",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-20T14:45:00Z",
      tasks_count: 12
    },
    {
      id: 2,
      name: "Application Mobile",
      created_at: "2024-01-10T09:15:00Z",
      updated_at: "2024-01-18T16:20:00Z",
      tasks_count: 8
    },
    {
      id: 3,
      name: "API Backend",
      created_at: "2024-01-05T11:00:00Z",
      updated_at: "2024-01-22T13:30:00Z",
      tasks_count: 15
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


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

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="hero min-h-96">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <div className="mockup-window border bg-base-300 mb-4">
                <div className="flex justify-center px-4 py-16 bg-base-200">
                  <div className="text-6xl">Vide</div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Aucun projet</h3>
              <p className="text-base-content/70 mb-6">
                Commencez par créer votre premier projet
              </p>
              <Link to="/projects/new" className="btn btn-primary btn-wide">
                Créer un projet
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <h2 className="card-title">
                  {project.name}
                  <div className="badge badge-secondary">{project.tasks_count}</div>
                </h2>
                
                <div className="stats stats-vertical shadow">
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
          ))}
        </div>
      )}      
    </div>
  );
};

export default ProjectsList;
