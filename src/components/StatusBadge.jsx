const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          className: 'badge-success',
          text: 'Terminée'
        };
      case 'pending':
        return {
          className: 'badge-warning',
          text: 'En cours'
        };
      default:
        return {
          className: 'badge-neutral',
          text: status
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`badge ${config.className}`}>
      {config.text}
    </div>
  );
};

export default StatusBadge;
