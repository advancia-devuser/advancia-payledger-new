import cors from 'cors';

export const corsConfig = cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:3000'
  ].filter(Boolean) as string[],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});
