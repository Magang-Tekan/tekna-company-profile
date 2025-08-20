import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface RealtimeOptions {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  schema?: string;
}

export function useRealtime(
  options: RealtimeOptions,
  onDataChange?: (payload: unknown) => void
) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    const supabase = createClient();
    
    // Create realtime subscription
    const newChannel = supabase
      .channel(`realtime-${options.table}`)
      .on(
        'postgres_changes',
        {
          event: options.event || '*',
          schema: options.schema || 'public',
          table: options.table,
          filter: options.filter
        },
        (payload) => {
          console.log('Realtime change:', payload);
          if (onDataChange) {
            onDataChange(payload);
          }
        }
      )
      .on('presence', { event: 'sync' }, () => {
        console.log('Presence sync');
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('Presence join:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('Presence leave:', key, leftPresences);
      })
      .on('error', (error) => {
        console.error('Realtime error:', error);
        setError(error.message);
      })
      .subscribe((status) => {
        console.log('Realtime status:', status);
        setIsConnected(status === 'SUBSCRIBED');
        
        if (status === 'SUBSCRIBED') {
          setError(null);
        }
      });

    setChannel(newChannel);

    // Cleanup function
    return () => {
      if (newChannel) {
        supabase.removeChannel(newChannel);
      }
    };
  }, [options.table, options.event, options.schema, options.filter, onDataChange]);

  const disconnect = () => {
    if (channel) {
      const supabase = createClient();
      supabase.removeChannel(channel);
      setChannel(null);
      setIsConnected(false);
    }
  };

  return {
    isConnected,
    error,
    disconnect,
    channel
  };
}

// Hook khusus untuk blog posts
export function useRealtimeBlogPosts(onDataChange?: (payload: unknown) => void) {
  return useRealtime(
    { table: 'posts' },
    onDataChange
  );
}

// Hook khusus untuk categories
export function useRealtimeCategories(onDataChange?: (payload: unknown) => void) {
  return useRealtime(
    { table: 'categories' },
    onDataChange
  );
}

// Hook khusus untuk authors
export function useRealtimeAuthors(onDataChange?: (payload: unknown) => void) {
  return useRealtime(
    { table: 'team_members' },
    onDataChange
  );
}

// Hook khusus untuk media files
export function useRealtimeMediaFiles(onDataChange?: (payload: unknown) => void) {
  return useRealtime(
    { table: 'media_files' },
    onDataChange
  );
}
