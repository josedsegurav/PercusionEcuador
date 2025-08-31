import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import QuickActions from './quickActions';
import { adminCard } from '@/app/utils/types';

export default function UserCard({ user }: { user: adminCard }) {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon
                                icon={faUsers}
                                className="text-white text-lg"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-orange-600">
                                ID: #{user.id}
                            </p>
                            <h3 className="text-lg font-bold text-orange-900">
                                {user.tab_title}
                            </h3>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Usuario
                        </span>
                    </div>
                </div>
            </div>

            {/* Card Content */}
            <div className="px-6 py-4">
                <div className="mb-4">
                    <p className="text-sm text-gray-500 font-medium mb-2">Descripción:</p>
                    <p className="text-gray-700 leading-relaxed">
                        {user.tab_description}
                    </p>
                </div>

                {/* Quick Actions Section */}
                <QuickActions
                    id={user.id}
                    type="users"
                    color="orange"
                />
            </div>
        </div>
    );
};