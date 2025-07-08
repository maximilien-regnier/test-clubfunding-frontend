import { Link } from 'react-router-dom';

const PageHeader = ({ 
  title, 
  subtitle = null,
  actions = [],
  backLink = null,
  backText = "Retour"
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        {backLink && (
          <Link to={backLink} className="btn btn-ghost btn-sm mb-2">
            ← {backText}
          </Link>
        )}
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && (
          <p className="text-base-content/70 mt-1">{subtitle}</p>
        )}
      </div>
      
      {actions.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {actions.map((action, index) => (
            action.link ? (
              <Link
                key={index}
                to={action.link}
                className={`btn ${action.primary ? 'btn-primary' : 'btn-outline'} ${action.className || ''}`}
              >
                {action.text}
              </Link>
            ) : (
              <button
                key={index}
                onClick={action.onClick}
                disabled={action.disabled}
                className={`btn ${action.primary ? 'btn-primary' : 'btn-outline'} ${action.className || ''}`}
              >
                {action.loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  action.text
                )}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
