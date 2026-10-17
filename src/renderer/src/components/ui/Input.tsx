import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?      : string
    error?      : string | null
}

export function Input ({ label, error, required, ...props }: InputProps) {
    return (
        <div className="field">
            {
                label && (
                    <label>{label}{required && <span className="required">*</span>}</label>
                )
            }
            <input {...props} />
            {error && <small className="field-error">{error}</small>}
        </div>
    )
}
