import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useRealtimeSync(table: string, onDataChange?: () => void) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table
        },
        () => {
          console.log(`Realtime change detected in ${table}`);
          if (onDataChange) {
            onDataChange();
          }
        }
      )
      .subscribe((status) => {
        console.log(`Realtime status for ${table}:`, status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, onDataChange]);

  return { isConnected };
}

// Hook khusus untuk blog posts
export function useRealtimeBlogPosts(onDataChange?: () => void) {
  return useRealtimeSync('posts', onDataChange);
}

// Hook khusus untuk categories
export function useRealtimeCategories(onDataChange?: () => void) {
  return useRealtimeSync('categories', onDataChange);
}

// Hook khusus untuk authors
export function useRealtimeAuthors(onDataChange?: () => void) {
  return useRealtimeSync('team_members', onDataChange);
}

// Hook khusus untuk media files
export function useRealtimeMediaFiles(onDataChange?: () => void) {
  return useRealtimeSync('media_files', onDataChange);
}
