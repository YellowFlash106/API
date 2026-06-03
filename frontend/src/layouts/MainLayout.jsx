import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const MainLayout = ({ children, title, subtitle }) => {
  return (
    <div className="flex h-screen bg-gray-100 w-64 bg-white shadow-md p-5 border-r">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar title={title} subtitle={subtitle} />

        <div className="p-6 space-y-6 overflow-y-auto">
          {children}
        </div>
      </div>

    </div>
  );
};

export default MainLayout;