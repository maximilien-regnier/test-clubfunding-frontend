import { Link } from 'react-router-dom';

const EmptyState = ({ 
  title, 
  message, 
  actionText, 
  actionLink, 
  actionOnClick,
  icon = null 
}) => {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="mb-4 text-4xl text-base-content/30">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-base-content/70 mb-4 max-w-md mx-auto">
        {message}
      </p>
      {(actionText && (actionLink || actionOnClick)) && (
        <div>
          {actionLink ? (
            <Link to={actionLink} className="btn btn-primary">
              {actionText}
            </Link>
          ) : (
            <button onClick={actionOnClick} className="btn btn-primary">
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
