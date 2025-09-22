import type { LeaveRequest } from "~/types/LeaveRequestType";
import type { User } from "~/types/UserType";
import styles from '~/styles/List.module.css';
import { useAuth } from "~/context/AuthContext";
import { fetchUserById } from "~/api/user";
import { approveLeaveRequest, rejectLeaveRequest, createLeaveRequest } from "~/api/leave";
import RightPanel from "~/components/RightPanel";
import { fetchReportingLines } from "~/api/reporting";
import { useEffect, useState } from "react";
import ApproveDialog from "~/components/ApproveDialog";
import MessageDialog from "~/components/MessageDialog";

interface LeaveRequestListProps {
    requests: LeaveRequest[];
    type: "my" | "all";
}

export default function LeaveRequestList({ requests, type }: LeaveRequestListProps) {
    const { user, token } = useAuth();
    const isAdmin = user?.token.role.name === "admin";
    const isManager = user?.token.role.name === "manager";

    // Map of userId to User details
    const [userDetails, setUserDetails] = useState<Record<number, User>>({});
    const [managerDetails, setManagerDetails] = useState<Record<number, User>>({});
    const [rightPanelOpen, setRightPanelOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
    const [reasonPanelOpen, setReasonPanelOpen] = useState(false);
    const [viewReason, setViewReason] = useState<string>("");
    const [reportingLines, setReportingLines] = useState<any[]>([]);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [approveTargetId, setApproveTargetId] = useState<number | null>(null);
    const [showApproveSuccess, setShowApproveSuccess] = useState(false);
    const [showRejectError, setShowRejectError] = useState(false);

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

    useEffect(() => {
        if (!token) return;
        fetchReportingLines(token).then(setReportingLines);
    }, [token]);

    // Approve handler: open dialog
    const handleApprove = (requestId: number) => {
        setApproveTargetId(requestId);
        setApproveDialogOpen(true);
    };

    // Called after ApproveDialog confirms
    const doApprove = async () => {
        if (approveTargetId && token) {
            try {
                await approveLeaveRequest(approveTargetId, String(token));
                setApproveDialogOpen(false);
                setShowApproveSuccess(true);
                // Optionally refetch data here instead of reload
                // if (onLeaveRequestCreated) onLeaveRequestCreated();
            } catch (error) {
                setApproveDialogOpen(false);
                setMessage({ type: "error", text: "Failed to approve leave request." });
            }
        }
        return true;
    };

    // Reject handler
    const handleReject = (requestId: number) => {
        setSelectedRequestId(requestId);
        setRightPanelOpen(true);
        setRejectReason(""); // reset reason
    };

    // Called when rejecting in the panel
    const doReject = async () => {
        if (!rejectReason.trim()) {
            setShowRejectError(true);
            return;
        }
        if (selectedRequestId && token) {
            await rejectLeaveRequest(selectedRequestId, String(token), rejectReason);
            window.location.reload();
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
                            {isAdmin && isManager && (
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
                            <div className={`${styles.listColumn2} ${styles.button}`}>
                                {/* Show "View Reason" button if rejected and has a reason */}
                                {req.status === "Rejected" && req.reason && (
                                    <button
                                        className="btn-details"
                                        onClick={() => {
                                            setViewReason(req.reason || "");
                                            setReasonPanelOpen(true);
                                        }}
                                    >
                                        View Reason
                                    </button>
                                )}
                            </div>

                            {(isAdmin || isManager) && type === "all" && (
                              <>
                                <div className={`${styles.listColumn2} ${styles.button}`}>
                                  <button className="btn-primary" onClick={() => handleApprove(req.id)}>Approve</button>
                                </div>
                                <div className={`${styles.listColumn2} ${styles.button}`}>
                                  <button className="btn-delete" onClick={() => handleReject(req.id)}>Reject</button>
                                </div>
                              </>
                            )}

                        </div>
                    );
                })}

            {/* ApproveDialog step */}
            <ApproveDialog
                open={approveDialogOpen}
                onClose={() => setApproveDialogOpen(false)}
                title="Approve Leave Request"
                message="Are you sure you want to approve this leave request?"
                approveAction={doApprove}
            />

            {/* Success message after approval */}
            {showApproveSuccess && (
                <MessageDialog
                    type="success"
                    message="Leave approved!"
                    onClose={() => setShowApproveSuccess(false)}
                />
            )}

            {/* Reject RightPanel */}
            <RightPanel
                open={rightPanelOpen}
                onClose={() => setRightPanelOpen(false)}
                title="Reject Leave Request"
                deleteTitle="Reject Leave Request"
                deleteAction={doReject}
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

            {/* Error message if reject reason missing */}
            {showRejectError && (
                <MessageDialog
                    type="error"
                    message="Please provide a reason for rejection."
                    onClose={() => setShowRejectError(false)}
                />
            )}

                {/* RightPanel for viewing rejection reason */}
                <RightPanel
                    open={reasonPanelOpen}
                    onClose={() => setReasonPanelOpen(false)}
                    title="Rejection Reason"
                    deleteTitle="Close"
                    deleteAction={() => setReasonPanelOpen(false)}
                    disableEdit={true}
                >
                    <div>
                        <label className="text-lg text-gray-600">Reason:</label>
                        <div className="mt-2 p-2 bg-gray-100 rounded text-gray-800" style={{ minHeight: 60 }}>
                            {viewReason || <span className="text-gray-400">No reason provided.</span>}
                        </div>
                    </div>
                </RightPanel>
        </div>
    );
}