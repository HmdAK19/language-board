import { NavLink, useMatch } from 'react-router-dom';

import { routePaths } from '../routes/paths';
import { usePageScrolled } from './usePageScrolled';

export const AppNavigation = () => {
  const isPublic = useMatch(routePaths.public) !== null;
  const isScrolled = usePageScrolled();

  return (
    <nav
      className={`app-nav ${isPublic ? 'is-public-nav' : 'is-admin-nav'}`}
      aria-label="Main navigation"
      data-scrolled={isScrolled || undefined}
    >
      <NavLink
        className="brand"
        to={isPublic ? routePaths.public : routePaths.management}
      >
        <span className="brand-icon" aria-hidden="true">
          文
        </span>
        <span>language board</span>
      </NavLink>

      {!isPublic && (
        <div className="admin-nav-context">
          <span>WORKSPACE</span>
          <strong>Admin Panel</strong>
          <small>content management</small>
        </div>
      )}

      <div className="nav-links">
        {isPublic ? (
          <>
            <NavLink
              className="public-management-link"
              to={routePaths.management}
            >
              Management Page <span aria-hidden="true">↗</span>
            </NavLink>
            <div className="public-nav-context">
              <span>Translations</span>
            </div>
          </>
        ) : (
          <NavLink to={routePaths.public}>
            Public Page <span aria-hidden="true">↗</span>
          </NavLink>
        )}
      </div>
    </nav>
  );
};
