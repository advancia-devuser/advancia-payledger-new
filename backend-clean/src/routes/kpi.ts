import { Router } from "express";

const router = Router();

router.get("/dashboard", (req: any, res: any) => {
  res.json({
    totalVolume: "1245678.90",
    activeUsers: 3421,
    successRate: "98.7",
    mrr: "45678.00",
    volumeOverTime: [
      { date: "2025-01-01", volume: "12345.67" },
      { date: "2025-01-02", volume: "13456.78" },
      { date: "2025-01-03", volume: "14567.89" },
      { date: "2025-01-04", volume: "15678.90" },
      { date: "2025-01-05", volume: "16789.01" },
      { date: "2025-01-06", volume: "17890.12" },
      { date: "2025-01-07", volume: "18901.23" },
    ],
    methodBreakdown: [
      { method: "card", count: 823, amount: "823456.78" },
      { method: "bank", count: 312, amount: "312345.67" },
      { method: "crypto", count: 97, amount: "97876.45" },
    ],
  });
});

export default router;
