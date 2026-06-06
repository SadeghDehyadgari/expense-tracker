import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for managing kebab (three-dots) menu state.
 * Returns:
 *   - openMenuId: string | null - id of the transaction whose menu is open
 *   - menuAbove: boolean - whether dropdown should appear above the button
 *   - menuRef: React ref object - attach to dropdown container for outside-click detection
 *   - buttonRefs: React.MutableRefObject<Object> - refs map for each kebab button (use .set(id, el))
 *   - handleKebabClick: function(id, event) - toggle menu for given id, with event.stopPropagation()
 *   - closeMenu: function - close any open menu
 */
const useKebabMenu = () => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuAbove, setMenuAbove] = useState(false);
  const menuRef = useRef(null);
  const buttonRefs = useRef({});

  // Close menu when clicking outside
  useEffect(() => {
    if (openMenuId === null) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
        setMenuAbove(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  // Calculate dropdown direction based on available space
  useEffect(() => {
    if (openMenuId === null) return;

    const timer = requestAnimationFrame(() => {
      const button = buttonRefs.current[openMenuId];
      if (!button) return;

      const scrollContainer = button.closest('.table-content.with-transactions');
      if (!scrollContainer) return;

      const buttonRect = button.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();
      const dropdownHeight = 100; // Fixed approximate height
      const spaceBelow = containerRect.bottom - buttonRect.bottom;
      const spaceAbove = buttonRect.top - containerRect.top;

      setMenuAbove(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
    });

    return () => cancelAnimationFrame(timer);
  }, [openMenuId]);

  const handleKebabClick = (id, event) => {
    event.stopPropagation();
    setOpenMenuId((prev) => {
      const newId = prev === id ? null : id;
      if (newId === null) setMenuAbove(false);
      return newId;
    });
  };

  const closeMenu = () => {
    setOpenMenuId(null);
    setMenuAbove(false);
  };

  return {
    openMenuId,
    menuAbove,
    menuRef,
    buttonRefs,
    handleKebabClick,
    closeMenu,
  };
};

export default useKebabMenu;
