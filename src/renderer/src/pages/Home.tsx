import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Loading from "@/components/Loading";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { usePageLoader } from "@/hooks/usePageLoader";
import { getProfile } from "@/store/controllers/auth.controller";
import { handleLogout } from "@/store/slices/authSlice";
import { removeToken } from "@/libs/storage";

export default function Home() {
    const dispatch                  = useAppDispatch()
    const navigate                  = useNavigate()
    const { profile, errorCode }    = useAppSelector(state => state.auth)
    const { isPageLoading, runWithLoader } = usePageLoader()

    const logout = async () => {
        await removeToken()
        dispatch(handleLogout())
        navigate("/sign-in", { replace: true })
    }

    useEffect(() => {
        runWithLoader(() => dispatch(getProfile()))
    }, [])

    useEffect(() => {
        if(errorCode == 401 || errorCode == 403){
            logout()
        }
    }, [errorCode])

    return (
        <>
        {isPageLoading && <Loading />}
        <div className="page">
            <div className="card profile">
                {profile?.avatar && <img className="avatar" src={profile.avatar} alt="avatar" />}
                <h2>{profile?.name ?? "-"}</h2>
                <p className="muted">{profile?.email ?? "-"}</p>
                <div className="badges">
                    <span className="badge">{profile?.role ?? "-"}</span>
                    <span className={`badge ${profile?.verified ? "success" : "danger"}`}>
                        {profile?.verified ? "verified" : "not verified"}
                    </span>
                </div>
            </div>

            {
                profile?.role === "admin" && (
                    <Link className="button" to="/users">Manage Users</Link>
                )
            }
            <button className="button outline" onClick={logout}>Logout</button>
        </div>
        </>
    )
}
