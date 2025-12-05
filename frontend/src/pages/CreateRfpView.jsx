import { CheckSquare, FileText, Send, Square } from "lucide-react";
import { useState } from "react";
import Loader from "../components/Loader";

export const CreateRFPView = ({ chatHistory, handleCreateRFP, chatMessage, setChatMessage, vendors, isLoading }) => {
    const [selectedVendorEmails, setSelectedVendorEmails] = useState([]);

    const toggleVendor = (email) => {
        setSelectedVendorEmails(prev => {
            if (prev.includes(email)) {
                return prev.filter(e => e !== email);
            } else {
                return [...prev, email];
            }
        });
    };

    const toggleAllVendors = () => {
        if (selectedVendorEmails.length === vendors.length) {
            setSelectedVendorEmails([]);
        } else {
            setSelectedVendorEmails(vendors.map(v => v.email));
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Create New RFP</h2>
                    <p className="text-sm text-gray-600 mt-1">Describe what you need in natural language</p>
                </div>

                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                    {chatHistory.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>Start by describing what you want to procure...</p>
                            <p className="text-sm mt-2">Example: "I need 20 laptops with 16GB RAM, budget $50,000, delivery in 30 days"</p>
                        </div>
                    )}
                </div>

                <div className="p-6 my-3 border-t border-gray-200">
                    {chatMessage && <>
                        <div className="border-t border-gray-200 pt-3">
                            <div className="flex justify-between items-center mb-2">
                                <div className="font-semibold">Select Vendors to Notify:</div>
                                <button
                                    onClick={toggleAllVendors}
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    {selectedVendorEmails.length === vendors.length ? 'Deselect All' : 'Select All'}
                                </button>
                            </div>

                            <div className="space-y-2 max-h-40 overflow-y-auto bg-gray-50 p-2 rounded">
                                {vendors.length > 0 ? (
                                    vendors.map((vendor) => (
                                        <div
                                            key={vendor._id || vendor.email}
                                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
                                            onClick={() => toggleVendor(vendor.email)}
                                        >
                                            <div className="text-blue-600">
                                                {selectedVendorEmails.includes(vendor.email)
                                                    ? <CheckSquare className="w-5 h-5" />
                                                    : <Square className="w-5 h-5" />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{vendor.name}</span>
                                                <span className="text-xs text-gray-500">{vendor.email}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-500 text-xs italic">No vendors available.</div>
                                )}
                            </div>
                        </div>

                    </>}

                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateRFP(selectedVendorEmails)}
                            placeholder="Describe your procurement needs..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={() => handleCreateRFP(selectedVendorEmails)}
                            className="bg-blue-600 text-white px-6 py-2 cursor-pointer rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            {isLoading ?
                                <Loader variant="inline" size="small" /> :
                                <>
                                    <Send className="w-4 h-4" />
                                    Send
                                </>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};