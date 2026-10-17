import { useEffect, useState } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router";
import Loading from "@/components/Loading";
import { getToken } from "@/libs/storage";
import SignIn from "@/pages/SignIn";
import Register from "@/pages/Register";
import Home from "@/pages/Home";
import Users from "@/pages/Users";

// Halaman yang butuh login (seperti authMiddleware di backend). guest = halaman sign-in/register.
function Guard({ guest = false, children }: { guest?: boolean, children: React.ReactNode }) {
    const [token, setTokenState] = useState<string | null | undefined>(undefined)

    useEffect(() => {
        getToken().then(setTokenState)
    }, [])

    if (token === undefined) return <Loading />
    if (guest && token) return <Navigate to="/home" replace />
    if (!guest && !token) return <Navigate to="/sign-in" replace />

    return <>{children}</>
}

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/sign-in"  element={<Guard guest><SignIn /></Guard>} />
                <Route path="/register" element={<Guard guest><Register /></Guard>} />
                <Route path="/home"     element={<Guard><Home /></Guard>} />
                <Route path="/users"    element={<Guard><Users /></Guard>} />
                <Route path="*"         element={<Navigate to="/home" replace />} />
            </Routes>
        </HashRouter>
    )
}
