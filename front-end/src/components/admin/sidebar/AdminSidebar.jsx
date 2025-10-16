import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import AdminSidebarItems from './AdminSidebarItems';

function AdminSidebar({ collapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItem, setExpandedItem] = useState(new Set());

  useEffect(() => {
    const newExpanded = new Set();
    AdminSidebarItems.forEach((item) => {
      if (item.subItems) {
        const isActiveSubItem = item.subItems.some(
          (subItem) => location.pathname === subItem.path
        );
        if (isActiveSubItem) newExpanded.add(item.id);
      }
    });
    setExpandedItem(newExpanded);
  }, [location.pathname]);

  const toggleExpanded = (item) => {
    const newExpanded = new Set(expandedItem);
    if (newExpanded.has(item.id)) {
      newExpanded.delete(item.id);
    } else {
      newExpanded.add(item.id);
      // Navigate to first subitem if no current subitem is active
      if (
        item.subItems &&
        item.subItems.length > 0 &&
        !item.subItems.some((sub) => sub.path === location.pathname)
      ) {
        navigate(item.subItems[0].path);
      }
    }
    setExpandedItem(newExpanded);
  };

  return (
    <div
      className={`${
        collapsed ? 'w-[80px]' : 'w-64'
      } bg-white border-r border-slate-200/50 flex flex-col transition-width duration-200 dark:bg-slate-900 dark:border-slate-700`}>
      {/* Logo */}
      {/* Logo */}
     <div className="h-[84px] flex items-center px-4 space-x-3 border-b-4 border-[#FDA811]">

      <NavLink to="/admin/dashboard" className="flex items-center space-x-3">
       <img
        src="/GSM_logo.png"
        alt="Logo"
        className={`object-cover rounded-xl transition-all duration-200 ${
        collapsed ? 'w-10 h-10' : 'w-13 h-13'
      }`}
     />
      {!collapsed && (
        <div>
          <h1 className="text-xl font-bold dark:text-white">GoServePH</h1>
          <p className="text-xs text-slate-500">Admin Dashboard</p>
        </div>
      )}
     </NavLink>
    </div>


      <hr className="border-slate-200 dark:border-slate-700 mx-2" />

      {/* Navigation Links */}
      <nav className="flex-1 p-2 space-y-2 overflow-y-auto">
        {AdminSidebarItems.map((item) => {
          const isActive =
            item.path === location.pathname ||
            (item.subItems &&
              item.subItems.some((subItem) => subItem.path === location.pathname));

          return (
            <div key={item.id}>
              {item.subItems ? (
                <>
                  <button
                    className={`w-full flex justify-between items-center p-2 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-[#4CAF50] text-white font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-[#4CAF50] hover:text-white dark:hover:bg-[#4CAF50] dark:hover:text-white'
                    }`}
                    onClick={() => toggleExpanded(item)}
                  >
                    <div className="flex items-center justify-center">
                      <item.icon
                        className={`transition-all duration-200 ${
                          collapsed ? 'w-5 h-5' : 'w-6 h-6'
                        }`}
                      />
                      {!collapsed && (
                        <span className="ml-2 text-sm font-medium">{item.label}</span>
                      )}
                    </div>
                    {!collapsed && item.subItems && (
                      <ChevronDown
                        className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                          expandedItem.has(item.id) ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {!collapsed && item.subItems && expandedItem.has(item.id) && (
                    <div className="ml-8 mt-2 space-y-1 border-l border-slate-300">
                      {item.subItems.map((subitem) => (
                        <NavLink
                          key={subitem.id}
                          to={subitem.path}
                          className={({ isActive }) =>
                            `block w-full ml-2 text-sm text-left p-2 ${
                              isActive
                                ? 'border-l-4 border-[#FDA811] text-[#4CAF50] font-semibold bg-transparent'
                                : 'text-slate-700 dark:text-slate-500 hover:bg-slate-200 dark:hover:text-slate-600 dark:hover:bg-slate-100'
                            }`
                          }
                        >
                          {subitem.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center p-2 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-[#4CAF50] text-white font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-[#4CAF50] hover:text-white dark:hover:bg-[#4CAF50] dark:hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center justify-center">
                    <item.icon
                      className={`transition-all duration-200 ${
                        collapsed ? 'w-5 h-5' : 'w-6 h-6'
                      }`}
                    />
                    {!collapsed && (
                      <span className="ml-2 text-sm font-medium">{item.label}</span>
                    )}
                  </div>
                </NavLink>
              )}
            </div>
          );
        })}
      </nav>

      <hr className="border-slate-300 dark:border-slate-700 mx-2" />
    </div>
  );
}

export default AdminSidebar;
