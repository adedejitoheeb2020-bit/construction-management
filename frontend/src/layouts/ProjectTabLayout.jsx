import { NavLink, Outlet, useParams } from "react-router-dom";

export default function ProjectTabsLayout() {
  const {id} = useParams();

  const tabs = [
    { name: "Overview", path: `/projects/${id}` },
    { name: "Materials", path: `/projects/${id}/materials` },
    { name: "lookahead", path: `/projects/${id}/lookahead` },
    { name: "Expenses", path: `/projects/${id}/expenses` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tabs Header */}
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex gap-6">
            {tabs.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.path}
                end
                className={({ isActive }) =>
                  `py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`
                }
              >
                {tab.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <Outlet />
      </div>
    </div>
  );
}
