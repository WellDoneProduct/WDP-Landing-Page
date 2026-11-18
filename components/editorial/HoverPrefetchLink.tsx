'use client';

import Link from 'next/link';
import { useState, type ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'prefetch'>;

// Skip viewport prefetching; prefetch only once the user shows intent (hover, touch, keyboard focus).
// Pattern from node_modules/next/dist/docs/01-app/02-guides/prefetching.md
export const HoverPrefetchLink = ({ onMouseEnter, onTouchStart, onFocus, ...props }: Props) => {
  const [active, setActive] = useState(false);
  return (
    <Link
      {...props}
      prefetch={active ? null : false}
      onMouseEnter={(event) => { setActive(true); onMouseEnter?.(event); }}
      onTouchStart={(event) => { setActive(true); onTouchStart?.(event); }}
      onFocus={(event) => { setActive(true); onFocus?.(event); }}
    />
  );
};
