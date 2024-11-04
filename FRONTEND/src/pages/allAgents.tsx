import { useEffect, useState } from "react";
import  api from '../api/axios';
import BackButton from "../components/BackButton";
interface User {
    id: string;
    login_id: string;
    role: string; 
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
}

interface Agent {
    id: string; 
    user: User;
}

function ViewAllAgents() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [promoting, setPromoting] = useState<string | null>(null);

    useEffect(() => {
        api.get<Agent[]>("/api/admin/agents/")
            .then(response => {
                if (Array.isArray(response.data)) {
                    setAgents(response.data);
                } else {
                    console.error("Unexpected response format:", response.data);
                    setError("Unexpected response format.");
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching agents:", error);
                setError("Failed to load agents. Please try again.");
                setLoading(false);
            });
    }, []);

    const promoteToMerchant = async (userId: string) => {
        setPromoting(userId);

        try {
            const response = await api.post(`/api/admin/promote-to-merchant/${userId}/`);
            if (response.status !== 201) {
                new Error("Failed to promote agent. Please try again.");
            }

            // Update agent list and local storage if promotion succeeds
            setAgents((prevAgents) =>
                prevAgents.map((agent) =>
                    agent.user.id === userId
                        ? { ...agent, user: { ...agent.user, role: "Merchant" } }
                        : agent
                )
            );

            if (userId === localStorage.getItem("currentUserId")) {
                localStorage.setItem("userRole", "Merchant");
            }

            alert("Agent promoted to Merchant successfully.");
        } catch (error) {
            console.error("Error promoting agent:", error);
            alert(error instanceof Error ? error.message : "An unexpected error occurred.");
        } finally {
            setPromoting(null);
        }
    };

    return (
        <div className="flex h-screen">
            <div className="flex-grow p-8">
                <BackButton />
                <h1 className="text-2xl mb-4">All Agents</h1>
                {loading ? (
                    <p>Loading agents...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {agents.map((agent) => (
                            <div
                                key={agent.id}
                                className="p-6 bg-[#6AE803] text-white rounded-lg shadow-md"
                            >
                                <h2 className="text-xl font-bold">{agent.user.first_name} {agent.user.last_name}</h2>
                                <p>Email: {agent.user.email}</p>
                                <p>Phone: {agent.user.phone_number}</p>
                                <p>Login ID: {agent.user.login_id}</p>
                                <p>Role: {agent.user.role}</p>

                                {agent.user.role !== "Merchant" && (
                                    <button
                                        onClick={() => promoteToMerchant(agent.user.id)}
                                        className="mt-4 px-4 py-2 bg-[#000000] text-white rounded"
                                        disabled={promoting === agent.user.id}
                                    >
                                        {promoting === agent.user.id ? "Promoting..." : "Promote to Merchant"}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewAllAgents;
