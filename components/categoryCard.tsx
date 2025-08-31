import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags } from '@fortawesome/free-solid-svg-icons';

import { adminCard } from '@/app/utils/types';
import QuickActions from './quickActions';

export default function CategoryCard ({ category } : { category: adminCard}) {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon
                                icon={faTags}
                                className="text-white text-lg"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-blue-600">
                                ID: #{category.id}
                            </p>
                            <h3 className="text-lg font-bold text-blue-900">
                                {category.tab_title}
                            </h3>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Categoría
                        </span>
                    </div>
                </div>
            </div>

            {/* Card Content */}
            <div className="px-6 py-4">
                <div className="mb-4">
                    <p className="text-sm text-gray-500 font-medium mb-2">Descripción:</p>
                    <p className="text-gray-700 leading-relaxed">
                        {category.tab_description}
                    </p>
                </div>

                {/* Quick Actions Section */}
                <QuickActions
                    id={category.id}
                    type="categories"
                    color="blue"
                />
            </div>
        </div>
    );
};