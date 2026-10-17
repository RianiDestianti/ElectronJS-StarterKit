import { useEffect, useState } from "react";
import { Link } from "react-router";
import Loading from "@/components/Loading";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { usePageLoader } from "@/hooks/usePageLoader";
import { deleteUser, getListUser } from "@/store/controllers/user.controller";
import { resetResponse } from "@/store/slices/userSlice";
import { User } from "@/store/types/UserType";

export default function Users() {
    const dispatch                              = useAppDispatch()
    const [keyword, setKeyword]                 = useState("")
    const [page, setPage]                       = useState<number>(1)

    const { users, total, response, error }     = useAppSelector((state) => state.user)
    const { isPageLoading, runWithLoader }      = usePageLoader()

    const loadData = (targetPage: number = page) => {
        runWithLoader(() => dispatch(getListUser({ keyword, page: targetPage })))
    }

    const handleChangePage = (targetPage: number) => {
        setPage(targetPage)
        loadData(targetPage)
    }

    const handleDeleteData = (user: User) => {
        if (confirm(`Delete ${user.name}?`)) {
            runWithLoader(() => dispatch(deleteUser(user.id)))
        }
    }

    useEffect(() => {
        loadData(1)
    }, [])

    useEffect(() => {
        if(response.delete){
            alert(response.delete.message)
            dispatch(resetResponse())
        }
    }, [response.delete])

    return (
        <>
        {isPageLoading && <Loading />}
        <div className="page">
            <div className="header">
                <Link className="button outline small" to="/home">Back</Link>
                <h2>Users ({total.data})</h2>
            </div>

            <input
                className="search"
                placeholder="Search name, email, phone"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                onKeyUp={(event) => event.key === "Enter" && handleChangePage(1)}
            />

            {error && <div className="alert">{error}</div>}

            {
                users.length ? users.map((user) => (
                    <div className="card row" key={user.id}>
                        <div className="row-info">
                            <strong>{user.name}</strong>
                            <small className="muted">{user.email}</small>
                            <small className="muted">{user.role}</small>
                        </div>
                        <button className="button danger small" onClick={() => handleDeleteData(user)}>Delete</button>
                    </div>
                )) : (
                    <p className="muted center">No data</p>
                )
            }

            <div className="pagination">
                <button className="button outline small" disabled={page <= 1} onClick={() => handleChangePage(page - 1)}>Previous</button>
                <span>{page} / {Math.max(total.pages, 1)}</span>
                <button className="button outline small" disabled={page >= total.pages} onClick={() => handleChangePage(page + 1)}>Next</button>
            </div>
        </div>
        </>
    )
}
