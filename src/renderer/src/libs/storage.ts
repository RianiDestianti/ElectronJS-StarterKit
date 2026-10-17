export const TOKEN_KEY = "auth-key"

// Token disimpan terenkripsi oleh main process (Electron safeStorage), diakses lewat preload (window.api).
export const getToken = (): Promise<string | null> => window.api.token.get()

export const setToken = (token: string): Promise<void> => window.api.token.set(token)

export const removeToken = (): Promise<void> => window.api.token.remove()
