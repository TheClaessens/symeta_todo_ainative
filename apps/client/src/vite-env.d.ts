/// <reference types="vite/client" />
interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  strictImportMetaEnv: true;
}

interface ImportMetaEnv {
  readonly NODE_ENV: 'development' | 'production';
  readonly VITE_ENVIRONMENT: 'local' | 'development' | 'qa' | 'production';
  readonly VITE_PORT: string;
  readonly VITE_BACKEND_URL: string;
  readonly VITE_SUPPRESS_WARNINGS?: 'true' | 'false';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
