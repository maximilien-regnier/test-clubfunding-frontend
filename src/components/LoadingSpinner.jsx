const LoadingSpinner = ({ size = 'sm', className = '' }) => {
  return (
    <span className={`loading loading-spinner loading-${size} ${className}`}></span>
  );
};

export default LoadingSpinner;
