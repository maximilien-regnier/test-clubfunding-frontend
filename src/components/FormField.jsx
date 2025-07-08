const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  required = false,
  placeholder,
  options = null,
  className = ''
}) => {
  const inputClasses = `input input-bordered w-full ${error ? 'input-error' : ''} ${className}`;
  const selectClasses = `select select-bordered w-full ${error ? 'select-error' : ''} ${className}`;

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </span>
      </label>
      
      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={selectClasses}
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`textarea textarea-bordered w-full ${error ? 'textarea-error' : ''} ${className}`}
          required={required}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
          required={required}
        />
      )}
      
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
};

export default FormField;
