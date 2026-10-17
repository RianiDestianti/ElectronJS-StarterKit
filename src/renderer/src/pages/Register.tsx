import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Input } from "@/components/ui/Input";
import Loading from "@/components/Loading";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { usePageLoader } from "@/hooks/usePageLoader";
import { handleActionRegister } from "@/store/controllers/auth.controller";
import { handleCleanResponse } from "@/store/slices/authSlice";
import { RegisterRequest } from "@/store/types/AuthType";
import { firstError, handleChangeInput } from "@/libs/general";
import { setToken } from "@/libs/storage";

export default function Register() {
    const dispatch          = useAppDispatch()
    const navigate          = useNavigate()
    const stateRegister     = useAppSelector(state => state.auth)
    const { isPageLoading, runWithLoader } = usePageLoader()

    const [request, setRequest] = useState<RegisterRequest>({
        name        : "",
        email       : "",
        password    : ""
    });

    const handleRegister = () => {
        runWithLoader(() => dispatch(handleActionRegister(request)))
    }

    useEffect(() => {
        dispatch(handleCleanResponse())
    }, [])

    useEffect(() => {
        if(stateRegister.responseRegister){
            setToken(stateRegister.responseRegister.key).then(() => {
                dispatch(handleCleanResponse())
                navigate("/home", { replace: true })
            })
        }
    }, [stateRegister.responseRegister])

    return (
        <>
        {isPageLoading && <Loading />}
        <div className="page-center">
            <div className="card auth-card">
                <h2 className="title">Create Account</h2>

                {
                    stateRegister.error && (
                        <div className="alert">{stateRegister.error}</div>
                    )
                }

                <Input
                    label="Name"
                    required
                    name="name"
                    placeholder="Enter name"
                    value={request.name}
                    error={firstError(stateRegister.errorFields, "name")}
                    onChange={(event) => handleChangeInput(event, setRequest)}
                />
                <Input
                    label="Email"
                    required
                    name="email"
                    placeholder="Enter email"
                    value={request.email}
                    error={firstError(stateRegister.errorFields, "email")}
                    onChange={(event) => handleChangeInput(event, setRequest)}
                />
                <Input
                    label="Password"
                    required
                    name="password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={request.password}
                    error={firstError(stateRegister.errorFields, "password")}
                    onChange={(event) => handleChangeInput(event, setRequest)}
                />

                <button className="button" onClick={handleRegister}>REGISTER</button>
                <Link className="button outline" to="/sign-in">Back to sign in</Link>
            </div>
        </div>
        </>
    )
}
