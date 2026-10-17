import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Input } from "@/components/ui/Input";
import Loading from "@/components/Loading";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { usePageLoader } from "@/hooks/usePageLoader";
import { handleActionLogin } from "@/store/controllers/auth.controller";
import { handleCleanResponse } from "@/store/slices/authSlice";
import { LoginRequest } from "@/store/types/AuthType";
import { firstError, handleChangeInput } from "@/libs/general";
import { setToken } from "@/libs/storage";

export default function SignIn() {
    const dispatch      = useAppDispatch()
    const navigate      = useNavigate()
    const stateLogin    = useAppSelector(state => state.auth)
    const { isPageLoading, runWithLoader } = usePageLoader()

    const [request, setRequest] = useState<LoginRequest>({
        email       : "",
        password    : ""
    });

    const handleLogin = () => {
        runWithLoader(() => dispatch(handleActionLogin(request)))
    }

    useEffect(() => {
        dispatch(handleCleanResponse())
    }, [])

    useEffect(() => {
        if(stateLogin.responseLogin){
            setToken(stateLogin.responseLogin.key).then(() => {
                dispatch(handleCleanResponse())
                navigate("/home", { replace: true })
            })
        }
    }, [stateLogin.responseLogin])

    return (
        <>
        {isPageLoading && <Loading />}
        <div className="page-center">
            <div className="card auth-card">
                <div className="brand">
                    <div className="logo">S</div>
                    <span>Skeleton</span>
                </div>

                {
                    stateLogin.error && (
                        <div className="alert">{stateLogin.error}</div>
                    )
                }

                <Input
                    label="Email"
                    required
                    name="email"
                    placeholder="Enter email"
                    value={request.email}
                    error={firstError(stateLogin.errorFields, "email")}
                    onChange={(event) => handleChangeInput(event, setRequest)}
                />
                <Input
                    label="Password"
                    required
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    value={request.password}
                    error={firstError(stateLogin.errorFields, "password")}
                    onChange={(event) => handleChangeInput(event, setRequest)}
                    onKeyUp={(event) => event.key === "Enter" && handleLogin()}
                />

                <button className="button" onClick={handleLogin}>SIGN IN</button>
                <Link className="button outline" to="/register">Create an account</Link>
            </div>
        </div>
        </>
    )
}
