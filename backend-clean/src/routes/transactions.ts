import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import {
  sendCSVResponse,
  sendExcelResponse,
  formatCurrency,
  formatDateTime,
  formatStatus,
  generateFilename,
} from "../utils/exportHelpers";

// In-memory transactions store for the MVP backend.
// This keeps TypeScript and the build clean without requiring Prisma
// configuration, while still matching the API shape used by Retool.

type Transaction = {
  id: string;
  amoun 
const transactions: Transaction[] = [];

function paginate<T>(items: T[], page: number, limit: number) {
  const start = (page - 1) * limit;
  const end = start + limit;
  const slice = items.slice(start, end);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return { data: slice, total, page, totalPages };
}

router.get("/", (req: any, res: any) => {
  const page = parseInt(String(req.query.page ?? "1"), 10) || 1;
  const limit = parseInt(String(req.query.limit ?? "50"), 10) || 50;

  const status = req.query.status
    ? String(req.query.status).toUpperCase()
    : undefined;
  const method = req.query.method
    ? String(req.query.method).toLowerCase()
    : undefined;

  let filtered = [...transactions];

  if (status) {
    filtered = filtered.filter((t) => t.status === status);
  }
  if (method) {
    filtered = filtered.filter((t) => t.method === method);
  }

  // Simple newest-first ordering
  filtered.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const result = paginate(filtered, page, limit);
  res.json(result);
});

router.post("/", (req: any, res: any) => {
  const { amount, currency, method, userId, description, status, metadata } =
    req.body ?? {};

  if (!amount || !currency || !method || !userId) {
    return res.status(400).json({
      error: "amount, currency, method, and userId are required",
    });
  }

  const now = new Date().toISOString();
  const tx: Transaction = {
    id: Date.now().toString(),
    amount: String(amount),
    currency: String(currency).toUpperCase(),
    method: String(method).toLowerCase(),
    status: status ? String(status).toUpperCase() : "PENDING",
    description: description ? String(description) : null,
    userId: String(userId),
    metadata,
    createdAt: now,
    updatedAt: now,
  };

  transactions.push(tx);
  res.status(201).json(tx);
});

router.get("/:id", (req: any, res: any) => {
  const { id } = req.params;
  const tx = transactions.find((t) => t.id === id);
  if (!tx) {
    return res.status(404).json({ error: "Transaction not found" });
  }
  res.json(tx);
});

router.put("/:id", (req: any, res: any) => {
  const { id } = req.params;
  const { amount, currency, method, userId, description, status, metadata } =
    req.body ?? {};

  const idx = transactions.findIndex((t) => t.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  const existing = transactions[idx];
  const updated: Transaction = {
    ...existing,
    amount: amount !== undefined ? String(amount) : existing.amount,
    currency:
      currency !== undefined
        ? String(currency).toUpperCase()
        : existing.currency,
    method:
      method !== undefined ? String(method).toLowerCase() : existing.method,
    userId: userId !== undefined ? String(userId) : existing.userId,
    description:
      description !== undefined
        ? description
          ? String(description)
          : null
        : existing.description,
    status:
      status !== undefined ? String(status).toUpperCase() : existing.status,
    metadata: metadata !== undefined ? metadata : existing.metadata,
    updatedAt: new Date().toISOString(),
  };

  transactions[idx] = updated;
  res.json(updated);
});

router.delete("/:id", (req: any, res: any) => {
  const { id } = req.params;
  const idx = transactions.findIndex((t) => t.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  transactions.splice(idx, 1);
  res.status(204).send();
});

// Export transactions to CSV
router.get("/export/csv", (req: any, res: any) => {
  const columns = [
    { key: "id", label: "Transaction ID" },
    { key: "createdAt", label: "Date", format: formatDateTime },
    { key: "amount", label: "Amount", format: (v: string) => formatCurrency(parseFloat(v)) },
    { key: "currency", label: "Currency" },
    { key: "method", label: "Payment Method" },
    { key: "status", label: "Status", format: formatStatus },
    { key: "description", label: "Description" },
    { key: "userId", label: "User ID" },
  ];

  const filename = generateFilename("transactions", "csv");
  sendCSVResponse(res, transactions, columns, filename);
});

// Export transactions to Excel
router.get("/export/excel", (req: any, res: any) => {
  const columns = [
    { key: "id", label: "Transaction ID" },
    { key: "createdAt", label: "Date", format: formatDateTime },
    { key: "amount", label: "Amount", format: (v: string) => formatCurrency(parseFloat(v)) },
    { key: "currency", label: "Currency" },
    { key: "method", label: "Payment Method" },
    { key: "status", label: "Status", format: formatStatus },
    { key: "description", label: "Description" },
    { key: "userId", label: "User ID" },
  ];

  const filename = generateFilename("transactions", "xls");
  sendExcelResponse(res, transactions, columns, filename, "Transaction Report");
});

export default router;
