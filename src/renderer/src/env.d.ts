/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly RENDERER_VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  api: {
    token: {
      get     : () => Promise<string | null>
      set     : (token: string) => Promise<void>
      remove  : () => Promise<void>
    }
  }
}
