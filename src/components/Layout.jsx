import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-base-200 w-full">
      {/* Navigation */}
      <div className="navbar bg-base-100 shadow-lg w-full">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16"></path>
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><Link to="/projects">Projets</Link></li>
            </ul>
          </div>
          <Link to="/projects" className="btn btn-ghost text-xl">
            Project Manager
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link 
                to="/projects" 
                className={`${isActive('/projects') ? 'active' : ''}`}
              >
                Projets
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
