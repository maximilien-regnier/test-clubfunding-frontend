import { useSelector } from 'react-redux';

const TasksPagination = ({ onPageChange }) => {
  const { pagination } = useSelector(state => state.tasks);
  const { current_page, last_page, total, per_page } = pagination;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= last_page && page !== current_page) {
      onPageChange(page);
    }
  };

  const handlePerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value);
    onPageChange(1, newPerPage);
  };

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, current_page - Math.floor(maxVisible / 2));
    let end = Math.min(last_page, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (last_page <= 1) {
    return null;
  }

  const startItem = (current_page - 1) * per_page + 1;
  const endItem = Math.min(current_page * per_page, total);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
      <div className="text-sm text-base-content/70">
        Affichage de {startItem} à {endItem} sur {total} tâches
      </div>

      <div className="flex items-center gap-4">
        <div className="form-control">
          <select
            value={per_page}
            onChange={handlePerPageChange}
            className="select select-bordered select-sm"
          >
            <option value={5}>5 par page</option>
            <option value={10}>10 par page</option>
            <option value={20}>20 par page</option>
            <option value={50}>50 par page</option>
          </select>
        </div>

        <div className="join">
          <button
            className="join-item btn btn-sm"
            onClick={() => handlePageChange(current_page - 1)}
            disabled={current_page === 1}
          >
            «
          </button>

          {getVisiblePages().map(page => (
            <button
              key={page}
              className={`join-item btn btn-sm ${page === current_page ? 'btn-active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="join-item btn btn-sm"
            onClick={() => handlePageChange(current_page + 1)}
            disabled={current_page === last_page}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default TasksPagination;
