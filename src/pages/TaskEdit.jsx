import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchTasksByProject } from '../store/slices/tasksSlice';
import TaskForm from '../components/TaskForm';

const TaskEdit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { items: tasks, loading } = useSelector(state => state.tasks);
  
  const task = tasks.find(t => t.id === parseInt(id));

  useEffect(() => {
    if (task && task.project_id && tasks.length === 0) {
      dispatch(fetchTasksByProject(task.project_id));
    }
  }, [dispatch, task, tasks.length]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="alert alert-warning">
        <span>Tâche non trouvée</span>
      </div>
    );
  }

  return <TaskForm task={task} isEdit={true} />;
};

export default TaskEdit;
