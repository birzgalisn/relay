import { useNavigate } from '@tanstack/react-router';

export function useClosePostsModal() {
  const navigate = useNavigate();

  return () => {
    void navigate({ to: '/posts', resetScroll: false });
  };
}
