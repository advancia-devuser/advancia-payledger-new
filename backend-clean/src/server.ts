import express from \ express\;
import cors from \cors\;
import helmet from \helmet\;
import dotenv from \dotenv\;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get(\/api/health\, (req, res) => \{
  res.json(\{ 
    status: \ok\, 
    message: \Advancia PayLedger API is running\,
    timestamp: new Date().toISOString()
  \});
\});

app.listen(PORT, () => \{
  console.log(🚀 API running on port \);
\});

export default app;
