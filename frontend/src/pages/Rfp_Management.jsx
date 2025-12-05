import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../constants/config';
import { DashboardView } from './DashboardView';
import { CreateRFPView } from './CreateRfpView';
import { VendorsView } from './VendorsView';
import { CompareView } from './CompareView';

export const RFPManagementApp = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const [rfps, setRfps] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRfpId, setSelectedRfpId] = useState(null);

    const [vendors, setVendors] = useState([
        { id: 1, name: "TechSupply Co", email: "sales@techsupply.com", rating: 4.5, lastContact: "2024-11-20" },
        { id: 2, name: "Office Solutions Inc", email: "info@officesolutions.com", rating: 4.2, lastContact: "2024-11-15" },
        { id: 3, name: "Global Tech Distributors", email: "bids@globaltech.com", rating: 4.8, lastContact: "2024-11-25" }
    ]);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory] = useState([]);

    const fetchRfps = async () => {
        try{
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/create-rfp`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            setIsLoading(false);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched RFPs:", data);

        setRfps(data?.data || []);
        setIsLoading(false);
        } catch (error) {
            toast.error("Failed to fetch RFPs");
            console.error("Error fetching RFPs:", error?.message);
            setIsLoading(false);
        }
    }

    const handleCreateRFP = async (selectedVendorEmails) => {
        if (!chatMessage.trim()) return;
        if (!selectedVendorEmails || selectedVendorEmails.length === 0) {
            toast.error("Please select at least one vendor to create an RFP.");
            return;
        }

        try {
            setIsLoading(true);

            const response = await fetch(`${API_BASE_URL}/create-rfp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userPrompt: chatMessage,
                    emails: selectedVendorEmails ?? []
                }),
            });

            if (!response.ok) {
                setIsLoading(false);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("RFP Created Successfully:", data);
            toast.success("RFP created successfully!");
            setIsLoading(false);

        } catch (error) {
            console.error("Error creating RFP:", error);
            toast.error("Failed to create RFP. Please try again.");
            setIsLoading(false);
        }

        setChatMessage('');
    };

    useEffect(() => {
        async function fetchVendors() {
            const response = await fetch(`${API_BASE_URL}/vendors`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Fetched Vendors:", data);

            setVendors(data?.data || []);
        }

        fetchRfps();
        fetchVendors();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <FileText className="w-6 h-6 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">RFP Manager</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setActiveView('dashboard')}
                                className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors ${activeView === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => setActiveView('create')}
                                className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors ${activeView === 'create' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                Create RFP
                            </button>
                            <button
                                onClick={() => setActiveView('vendors')}
                                className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors ${activeView === 'vendors' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                Vendors
                            </button>
                            {selectedRfpId &&
                                <button
                                    onClick={() => setActiveView('compare')}
                                    className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors ${activeView === 'compare' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    Compare
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {activeView === 'dashboard' && <DashboardView rfps={rfps} vendors={vendors} setActiveView={setActiveView} isLoading={isLoading} setSelectedRfpId={setSelectedRfpId} fetchRfps={fetchRfps} />}
                {activeView === 'create' && <CreateRFPView chatHistory={chatHistory} handleCreateRFP={handleCreateRFP} chatMessage={chatMessage} setChatMessage={setChatMessage} vendors={vendors} />}
                {activeView === 'vendors' && <VendorsView vendors={vendors} />}
                {activeView === 'compare' && selectedRfpId && <CompareView selectedRfpId={selectedRfpId} />}
            </main>
        </div>
    );
};

export default RFPManagementApp;