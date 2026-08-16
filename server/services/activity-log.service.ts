import { createClient } from '@/lib/supabase/server';
import { cookies, headers } from 'next/headers';

export interface AuthActivityLog {
  id?: string;
  actor_type: 'member' | 'admin';
  identifier: string; // phone or email or username
  name?: string;
  event_type: 'LOGIN' | 'LOGOUT' | 'OTP_REQUEST';
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

// In-memory persistent demo store
export const MOCK_ACTIVITY_LOGS: AuthActivityLog[] = [
  {
    id: 'log-1',
    actor_type: 'admin',
    identifier: 'admin',
    name: 'Administrator',
    event_type: 'LOGIN',
    ip_address: '127.0.0.1',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'log-2',
    actor_type: 'member',
    identifier: '081234567890',
    name: 'Jessica Angelia',
    event_type: 'LOGIN',
    ip_address: '127.0.0.1',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
];

export class ActivityLogService {
  static async record(entry: Omit<AuthActivityLog, 'id' | 'created_at'>): Promise<AuthActivityLog> {
    const timestamp = new Date().toISOString();
    let userAgent = entry.user_agent;
    let ip = entry.ip_address;

    try {
      const headerList = await headers();
      if (!userAgent) userAgent = headerList.get('user-agent') || 'Browser Client';
      if (!ip) ip = headerList.get('x-forwarded-for') || headerList.get('x-real-ip') || '127.0.0.1';
    } catch {
      // Ignore if called outside request context
    }

    const logItem: AuthActivityLog = {
      id: `log-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      actor_type: entry.actor_type,
      identifier: entry.identifier,
      name: entry.name,
      event_type: entry.event_type,
      ip_address: ip,
      user_agent: userAgent,
      metadata: entry.metadata || {},
      created_at: timestamp,
    };

    // Store in mock memory
    MOCK_ACTIVITY_LOGS.unshift(logItem);

    // Attempt to store in Supabase
    try {
      const supabase = await createClient();
      await supabase.from('auth_activity_logs').insert({
        actor_type: logItem.actor_type,
        identifier: logItem.identifier,
        name: logItem.name,
        event_type: logItem.event_type,
        ip_address: logItem.ip_address,
        user_agent: logItem.user_agent,
        metadata: logItem.metadata,
      });
    } catch {
      // Fallback in-memory
    }

    return logItem;
  }

  static async getLogs(options?: {
    identifier?: string;
    actor_type?: 'member' | 'admin';
    limit?: number;
  }): Promise<AuthActivityLog[]> {
    const limit = options?.limit || 50;

    try {
      const supabase = await createClient();
      let query = supabase
        .from('auth_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (options?.identifier) {
        query = query.eq('identifier', options.identifier);
      }
      if (options?.actor_type) {
        query = query.eq('actor_type', options.actor_type);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as AuthActivityLog[];
      }
    } catch {
      // Fallback
    }

    // Fallback to in-memory logs
    let results = [...MOCK_ACTIVITY_LOGS];
    if (options?.identifier) {
      results = results.filter((l) => l.identifier === options.identifier);
    }
    if (options?.actor_type) {
      results = results.filter((l) => l.actor_type === options.actor_type);
    }
    return results.slice(0, limit);
  }
}
