import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../constants/config";
import toast from "react-hot-toast";
import { StatusBadge } from "../components/StatusBadge";
import { CheckCircle, Inbox, TrendingUp } from "lucide-react";
import RfpSkeleton from "../components/RfpSkeleton";
import RefreshButton from "../components/RefreshButton";
export const CompareView = ({ selectedRfpId }) => {

    const [proposals, setProposals] = useState(null);
    const [rfp, setRfp] = useState(null);
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const requirementString = rfp?.items?.map(item => `${item?.quantity} ${item?.itemName}`).join(' & ') || "";
    const proposalWithMaxAiScore = proposals ? proposals?.reduce((max, current) => {
        return current?.aiAnalysis?.score > max?.aiAnalysis?.score ? current : max;
    }, proposals[0]) : null;

    async function fetchProposals() {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/proposals`, {
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
            console.log("Fetched Proposals for Comparison:", data);
            setProposals(data?.data || []);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error("Error fetching proposals:", error);
        }
    }

    const sendOrderConfirmationEmail = async (bestProposal) => {
        try {
            const response = await fetch(`${API_BASE_URL}/proposals/placeOrder/${bestProposal?._id}/${bestProposal?.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    senderName: bestProposal?.sender,
                }),
            });

            if (response.ok) {
                toast.success("Order confirmation email sent successfully 🎉");
                setOrderConfirmed(true);
            }
        }

        catch (error) {
            console.error("Error sending order confirmation email:", error);
            toast.error("Failed to send order confirmation email: " + error?.message);
        }
    }

    useEffect(() => {
        async function fetchRfp() {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/create-rfp/${selectedRfpId}`, {
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

            setRfp(data?.data || []);
            setIsLoading(false);
        }

        if (selectedRfpId) {
            fetchProposals();
            fetchRfp();
        }
    }, [selectedRfpId]);

    console.log("Proposals to compare:", proposals);
    console.log("Proposal with max AI score:", proposalWithMaxAiScore);

    return (
        <div className="space-y-6">
            {!rfp ? <RfpSkeleton /> :
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">{"Requirement: " + requirementString}</h2>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">Budget:</span>
                            <p className="font-semibold">{"$ " + rfp?.budget_in_$}</p>
                        </div>
                        <div>
                            <span className="text-gray-600">Expected Delivery:</span>
                            <p className="font-semibold">{rfp?.expectedDeliveryDate?.toLocaleString()}</p>
                        </div>
                        <div>
                            <span className="text-gray-600">Proposals:</span>
                            <p className="font-semibold">{proposals?.length || 0} received</p>
                        </div>
                        <div>
                            <span className="text-gray-600">Status:</span>
                            <StatusBadge status={`${proposals?.length > 0 ? "proposals_received" : "draft"}`} />
                        </div>
                    </div>
                </div>
            }

            {proposalWithMaxAiScore && <div className="bg-linear-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
                <div className="flex items-start gap-4">
                    <TrendingUp className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">AI Recommendation</h3>
                        <p className="text-gray-700 mb-4">
                            {proposalWithMaxAiScore?.aiAnalysis?.summary || "This proposal has the highest AI score based on your RFP requirements."}
                        </p>
                        <div className="flex gap-3">
                            {(proposalWithMaxAiScore?.orderConfirmed || orderConfirmed) ?
                                <span className="text-green-400 px-4 py-2 rounded font-medium transition-colors">Order Given to {proposalWithMaxAiScore?.sender} 🎉</span>
                                :
                                <button className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors" onClick={() => sendOrderConfirmationEmail(proposalWithMaxAiScore)}>
                                    Accept & Award
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
            }

            {proposals?.length === 0 && <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <Inbox className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No proposals received yet</h3>
                <p className="text-gray-500 max-w-sm">
                    Vendors haven't responded to this RFP yet. Check back later to compare their offers.
                </p>
                <RefreshButton onClick={() => fetchProposals()} isLoading={isLoading} />

            </div>

            }

            {
                !proposals && isLoading &&
                <RfpSkeleton />
            }

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {proposals?.map((proposal) => (
                    <div className="bg-white rounded-lg shadow-sm border border-green-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                <h3 className="font-semibold text-gray-900">{proposal?.sender}</h3>
                            </div>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Price:</span>
                                <span className="font-semibold text-gray-900">{proposal?.cost}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Delivery Time:</span>
                                <span className="font-semibold text-gray-900">{Math.floor((new Date(proposal?.deliveryDate) - new Date()) / (1000 * 60 * 60 * 24))} days</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Payment Terms:</span>
                                <span className="font-semibold text-gray-900">Net {Math.floor((new Date(proposal?.dateForPayment) - new Date(proposal?.deliveryDate)) / (1000 * 60 * 60 * 24))}</span>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <div className="text-sm text-gray-600 mb-2">AI Score: {proposal?.aiAnalysis?.score}</div>
                        </div>
                    </div>
                ))
                }
            </div>
        </div>
    );
}