import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import LoadingSpinner from './LoadingSpinner';

const TaskCard = ({ task, onDelete, formatDate, deleting }) => {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-300">
      <div className="card-body p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="card-title text-lg">{task.title}</h3>
          <StatusBadge status={task.status} />
        </div>
        
        <div className="text-sm text-base-content/70 mb-4">
          <div>Créée le {formatDate(task.created_at)}</div>
          {task.updated_at !== task.created_at && (
            <div>Modifiée le {formatDate(task.updated_at)}</div>
          )}
        </div>

        <div className="card-actions justify-end">
          <div className="join">
            <Link 
              to={`/tasks/${task.id}/edit`} 
              className="btn btn-outline btn-sm join-item"
            >
              Modifier
            </Link>
            <button 
              className="btn btn-error btn-outline btn-sm join-item"
              onClick={() => onDelete(task)}
              disabled={deleting}
            >
              {deleting ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Supprimer'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
