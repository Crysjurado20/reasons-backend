import cors from 'cors'

const ACCEPTED_ORIGINS: string[] = [
  'http://localhost:4200'
];

interface CorsOptions {
  acceptedOrigins?: string[];
}

export const corsMiddleware = ({acceptedOrigins = ACCEPTED_ORIGINS}: CorsOptions = {}) => cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allowed: boolean) => void) => {
    if (origin === undefined || acceptedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return (callback(new Error('No permitido por CORS'), false));
  }
});