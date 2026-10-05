import { CodegenConfig } from '@graphql-codegen/cli';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
// import.meta.env is not available in the codegen script
dotenv.config();
const config: CodegenConfig = {
  schema: `${process.env.VITE_BACKEND_URL}/graphql`,
  documents: ['src/**/*.graphql'],
  generates: {
    'src/graphql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true, // Enable React hook generation
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
