import type { LeaveRequest } from "~/types/LeaveRequestType";
import type { User } from "~/types/UserType";
import styles from '~/styles/List.module.css';
import { useAuth } from "~/context/AuthContext";
import { fetchUserById } from "~/api/user";
import { useEffect, useState } from "react";
import { approveLeaveRequest, rejectLeaveRequest } from "~/api/leave";
import RightPanel from "~/components/RightPanel";

interface LeaveRequestListProps {
    requests: LeaveRequest[];
    type: "my" | "all";
}

export default function LeaveRequestList({ requests, type }: LeaveRequestListProps) {
    const { user, token } = useAuth();
    const isAdmin = user?.token.role.name === "admin";

    // Map of userId to User details
    const [userDetails, setUserDetails] = useState<Record<number, User>>({});
    const [managerDetails, setManagerDetails] = useState<Record<number, User>>({});
    const [rightPanelOpen, setRightPanelOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

    useEffect(() => {
        // Get unique user IDs from requests
        const uniqueUserIds = Array.from(new Set(requests.map(r => r.user.id)));
        // Only fetch if not already in state
        uniqueUserIds.forEach(id => {
            if (typeof id === "number" && !userDetails[id] && token) {
                fetchUserById(id, token).then(u => {
                    setUserDetails(prev => ({ ...prev, [id]: u }));
                });
            }
        });
        // eslint-disable-next-line
    }, [requests, token]);

    const handleApprove = (requestId: number) => async () => {
        if (token) {
            try {
                await approveLeaveRequest(requestId, String(token));
                alert("Leave request approved.");
                window.location.reload();
            } catch (error) {
                alert("Failed to approve leave request.");
            }
        }
    };

    const handleReject = (requestId: number, reason: string) => async () => {
        if (token) {
            try {
                await rejectLeaveRequest(requestId, String(token), reason);
                alert("Leave request rejected.");
                window.location.reload();
            } catch (error) {
                alert("Failed to reject leave request.");
            }
        }
    };

    return (
        <div>
            {requests
                .filter(req => req.status !== "Cancelled")
                .map(req => {
                    let statusClass = "";
                    if (req.status === "Approved") statusClass = styles["status-approved"];
                    else if (req.status === "Rejected") statusClass = styles["status-rejected"];
                    else statusClass = styles["status-pending"];

                    // Get user email if loaded
                    const userId = req.user.id ?? 0;
                    const email = userDetails[userId]?.email;

                    return (
                        <div key={req.id} className={styles.listRow2}>
                            {isAdmin && (
                                <div className={`${styles.listColumn2} ${styles.date}`}>
                                    {email}
                                </div>
                            )}
                            <div className={`${styles.listColumn2} ${styles.date} py-3`}>{req.startDate}</div>
                            <div className={`${styles.listColumn2} ${styles.date}`}>{req.endDate}</div>
                            <div className={`${styles.days}`}>{req.days}</div>
                            <div className={`${styles.listColumn2} ${styles.date}`}>
                                <span className={statusClass}>
                                    {req.status}
                                </span>
                            </div>
                            <div className={`${styles.listColumn2} ${styles.button}`}></div>

                             {/* {req.status === "Rejected" && (
                                 <div className={`${styles.listColumn2} ${styles.button}`}>
                                     <button className="btn-details">View Reason</button>
                                 </div>
                             )} */}

                            {isAdmin && type === "all" && (
                                <>
                                <div className={`${styles.listColumn2} ${styles.button}`}>
                                    <button className="btn-primary" onClick={handleApprove(req.id)}>Approve</button>
                                    
                                </div>

                                <div className={`${styles.listColumn2} ${styles.button}`}>
                                    <button className="btn-delete" onClick={() => {
                                        setSelectedRequestId(req.id);
                                        setRightPanelOpen(true);
                                        setRejectReason(""); // reset reason
                                    }}>Reject</button>
                                </div>
                                </>
                             )}

                        </div>
                    );
                })}

                <RightPanel
                    open={rightPanelOpen}
                    onClose={() => setRightPanelOpen(false)}
                    title="Reject Leave Request"
                    deleteTitle="Reject Leave Request"
                    deleteAction={async () => {
                        if (selectedRequestId && token) {
                            await rejectLeaveRequest(selectedRequestId, String(token), rejectReason);
                            window.location.reload();
                        }
                    }}
                    onCancel={() => setRightPanelOpen(false)}
                    disableEdit={true}
                >
                    <div>
                        <label className="text-lg text-gray-600">Reason for rejection:</label>
                        <textarea
                            className="input mt-2"
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            style={{ width: "100%", resize: "none" }}
                            rows={4}
                            required
                        />
                    </div>
                </RightPanel>
        </div>
    );
}