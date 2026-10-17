import { ChangeEvent } from "react";

type SetState<State> = React.Dispatch<React.SetStateAction<State>>;

export const handleChangeInput = <State extends Record<string, any>>(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    setValue: SetState<State>
) => {
    const { name, value } = event.target;

    setValue(prevState => ({
        ...prevState,
        [name]: value
    }));
};

export const firstError = (errorFields: Record<string, string[]> | null, field: string): string | null => {
    return errorFields?.[field]?.[0] ?? null
}
