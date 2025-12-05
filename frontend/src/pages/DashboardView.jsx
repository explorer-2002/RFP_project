import { Calendar, ChevronRight, Clock, DollarSign, FileText, Package, Users } from "lucide-react";
import RfpSkeleton from "../components/RfpSkeleton";
import RefreshButton from "../components/RefreshButton";

export const DashboardView = ({ vendors, rfps, setActiveView, setSelectedRfpId, isLoading, fetchRfps }) => {
    //to update pending reviews

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-t-4 border-t-blue-500 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active RFPs</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{rfps?.length || 0}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-t-4 border-t-green-500 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Registered Vendors</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{vendors?.length || 0}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-t-4 border-t-orange-500 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending Reviews</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">1</p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg">
                            <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent RFPs Section */}
            { rfps === null ?
                <RfpSkeleton />
                :
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            Recent RFPs
                        </h2>

                        <RefreshButton onClick={() => fetchRfps()} isLoading={isLoading} />
                    </div>
                    <div className="divide-y divide-gray-100">
                        {rfps?.length === 0 ? <div className="text-gray-400 font-semibold">No RFPs found. Create your first RFP</div> : rfps.map(rfp => (
                            <div
                                key={rfp._id}
                                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors group"
                                onClick={() => {
                                    setSelectedRfpId(rfp._id);
                                    setActiveView('compare');
                                }}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${rfp?.orderPlaced?.isPlaced > 0
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                }`}>
                                                {rfp?.orderPlaced?.isPlaced ? 'Order Placed' : 'Active'}
                                            </span>
                                            <span className="text-xs text-gray-400 font-mono">ID: {rfp._id.slice(-6).toUpperCase()}</span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span>Due {new Date(rfp?.expectedDeliveryDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 text-gray-400" />
                                                <span className="font-semibold text-gray-900">{rfp.budget_in_$.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-gray-400" />
                                                <span>{rfp.proposalIds?.length || 0} proposals</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-4 flex-1">
                                        <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                                            {rfp.items.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md border border-gray-200 text-sm text-gray-700"
                                                >
                                                    <Package className="w-3.5 h-3.5 text-gray-500" />
                                                    <span className="font-medium">{item.itemName}</span>
                                                    <span className="bg-white px-1.5 rounded text-xs font-bold text-gray-500 border border-gray-200">
                                                        x{item.quantity}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    )
};