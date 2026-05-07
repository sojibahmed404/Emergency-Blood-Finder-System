import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b141a] flex transition-colors duration-300">
      {/* Sidebar - Handles its own responsive behavior */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300 ease-in-out">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#f8f9fa] dark:bg-[#0b141a] transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  )
}
