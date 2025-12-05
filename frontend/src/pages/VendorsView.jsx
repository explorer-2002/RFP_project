import { Plus } from "lucide-react";

export const VendorsView = ({ vendors }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Vendor Management</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Vendor
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.map(vendor => (
                <div key={vendor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{vendor.email}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                            <span className="text-yellow-600 font-semibold text-sm">{vendor.rating}</span>
                            <span className="text-yellow-600 text-xs">★</span>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                        Registered At : {vendor.createdAt}
                    </div>
                </div>
            ))}
        </div>
    </div>
);