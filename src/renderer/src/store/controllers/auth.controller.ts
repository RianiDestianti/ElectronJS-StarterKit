import api from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginRequest, RegisterRequest } from "../types/AuthType";

export const handleActionLogin = createAsyncThunk('auth/login', async (payload: LoginRequest) => {
    const response = (await api.post(`/login`, payload)).data
    return response
})

export const handleActionRegister = createAsyncThunk('auth/register', async (payload: RegisterRequest) => {
    const response = (await api.post(`/register`, payload)).data
    return response
})

export const getProfile = createAsyncThunk('auth/profile', async () => {
    const response = (await api.get(`/check-auth`)).data
    return response
})
