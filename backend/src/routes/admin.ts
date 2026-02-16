import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { store } from '../store';
import { isSupabaseEnabled, supabaseListRegisteredUsers } from '../supabase';

const router = Router();

const getJwtSecret = () => process.env.JWT_SECRET || 'default-secret';

function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '';
  const list = raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  return list.length > 0 ? list : ['admin@advanciapayledger.com'];
}

function requireAdmin(req: Request, res: Response, next: any) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No authorization header' });

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, getJwtSecret());

    const admins = getAdminEmails();
    if (admins.length === 0) {
      return res.status(403).json({ error: 'Admin access not configured' });
    }

    const email = String(decoded?.email || '').toLowerCase();
    if (!email || !admins.includes(email)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    (req as any).adminEmail = email;
    return next();
  } catch (_err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

router.get('/users', requireAdmin, async (_req: Request, res: Response) => {
  if (!isSupabaseEnabled()) {
    return res.json({ users: store.listUsers() });
  }

  try {
    const users = await supabaseListRegisteredUsers();
    return res.json({ users });
  } catch (err) {
    console.error('Supabase list users failed:', err);
    return res.json({ users: store.listUsers() });
  }
});

export default router;
