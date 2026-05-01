import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook to manage tooltip state and handlers for description cells.
 * Returns tooltip state and memoized event handlers to avoid unnecessary re-renders.
 */

export const useTooltip = () => {
  const [tooltip, setTooltip] = useState({
    visible: false,
    text: '',
    x: 0,
    y: 0,
  });

  const triggerRef = useRef(null);
  const tooltipRef = useRef(tooltip); // keep latest state without adding dependencies

  useEffect(() => {
    tooltipRef.current = tooltip;
  }, [tooltip]);

  const hideTooltip = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  const showTooltip = useCallback((text, triggerEl) => {
    const rect = triggerEl.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.bottom + 8;
    setTooltip({ visible: true, text, x, y });
  }, []);

  const handleMouseEnter = useCallback(
    (text) => (e) => {
      showTooltip(text, e.currentTarget);
    },
    [showTooltip]
  );

  const handleMouseLeave = useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);

  // Decision made outside setTooltip callback to prevent double‑invocation issues (e.g. Strict Mode)
  const handleClick = useCallback(
    (text) => (e) => {
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.bottom + 8;

      const current = tooltipRef.current;
      if (current.visible && current.text === text) {
        setTooltip((prev) => ({ ...prev, visible: false }));
      } else {
        setTooltip({ visible: true, text, x, y });
      }
    },
    []
  );

  return {
    tooltip,
    triggerRef,
    showTooltip,
    hideTooltip,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
  };
};
