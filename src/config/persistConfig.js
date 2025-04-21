import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { queryClient } from './queryClient';

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'rq-popular-cache',
  throttleTime: 1000,
});

// ✅ 캐시를 localStorage에 영속 저장 (6시간)
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 6,
});