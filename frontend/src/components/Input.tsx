import { InputHTMLAttributes, forwardRef } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, id, className = '', ...props }, ref) => {
        return (
            <div className={`input-group ${className}`}>
                {label && <label htmlFor={id} className="input-label">{label}</label>}
                <input
                    ref={ref}
                    id={id}
                    className={`input-field ${error ? 'input-error' : ''}`}
                    {...props}
                />
                {error && <span className="input-error-text">{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
