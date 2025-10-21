import hhLogo from "../../assets/images/hh.png";
import { 
  FileText, 
  FolderOpen, 
  User, 
  Bell, 
  KeyRound, 
  ExternalLink, 
  LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

function NavAdmin({ activeTab, setActiveTab, sidebarOpen, onNavigateHome }) {
    const { logout } = useAuth();
    const menuItems = [
        { icon: FileText, label: 'Article management', value: 'article' },
        { icon: FolderOpen, label: 'Category management', value: 'category' },
        { icon: User, label: 'Profile', value: 'profile' },
        { icon: Bell, label: 'Notification', value: 'notification' },
        { icon: KeyRound, label: 'Reset password', value: 'reset' },
    ];

    return (
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-[#DAD6D1] border-r border-gray-200 transition-all duration-300 overflow-hidden flex flex-col`}>
            <div className="p-6 flex flex-col gap-4 mb-8 mt-10">
                <img src={hhLogo} alt="logo" className="w-14 h-7" />
                <h4 className="text-xl font-semibold text-[#F2B68C]">Admin panel</h4>
            </div>

            <nav className="">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setActiveTab(item.value);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-5 cursor-pointer text-sm transition-colors ${
                            activeTab === item.value 
                                ? 'bg-[#c0b5a6] text-gray-900 font-medium' 
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className='text-base font-medium text-[#43403B'>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className=" border-gray-500 mt-auto">
                <button 
                    className="w-full border-b flex items-center gap-3 p-5 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={onNavigateHome}
                >
                    <ExternalLink className="w-5 h-5" />
                    <span className='text-base font-medium text-[#75716B]'>hh. website</span>
                </button>
                <button 
                    className="w-full flex items-center gap-3 p-5 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={logout}
                >
                    <LogOut className="w-5 h-5" />
                    <span className='text-base font-medium text-[#75716B]'>Log out</span>
                </button>
            </div>
        </aside>
    );
}

export default NavAdmin;

