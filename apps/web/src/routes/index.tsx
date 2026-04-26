import { createFileRoute } from '@tanstack/react-router';

import { Landing } from '../packages/landing';

export const Route = createFileRoute('/')({
  component() {
    return <Landing />;
  },
});
