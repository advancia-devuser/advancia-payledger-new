import { createClient } from '@supabase/supabase-js';

type SupabaseUserRow = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
};

const getSupabaseConfig = () => {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return { url, serviceRoleKey };
};

export const isSupabaseEnabled = () => !!getSupabaseConfig();

const getClient = () => {
  const config = getSupabaseConfig();
  if (!config) return null;
  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

export async function supabaseUpsertRegisteredUser(input: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}) {
  const client = getClient();
  if (!client) return;

  const { error } = await client
    .from('registered_users')
    .upsert(
      {
        id: input.id,
        email: input.email,
        first_name: input.firstName,
        last_name: input.lastName,
        created_at: input.createdAt.toISOString(),
      },
      { onConflict: 'id' }
    );

  if (error) {
    throw error;
  }
}

export async function supabaseListRegisteredUsers(): Promise<
  Array<{ id: string; email: string; firstName: string; lastName: string; createdAt: string }>
> {
  const client = getClient();
  if (!client) return [];

  const { data, error } = await client
    .from('registered_users')
    .select('id,email,first_name,last_name,created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  const rows = (data || []) as SupabaseUserRow[];
  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    firstName: r.first_name || '',
    lastName: r.last_name || '',
    createdAt: r.created_at,
  }));
}
