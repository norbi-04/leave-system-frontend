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
    // Check if user is admin or manager
    const isAdmin = user?.token.role.name === "admin";
    const isManager = user?.token.role.name === "manager";

    // Store user details for each request
    const [userDetails, setUserDetails] = useState<Record<number, User>>({});
    // Store manager details (not used in this code)
    const [managerDetails, setManagerDetails] = useState<Record<number, User>>({});
    // Controls visibility of the right panel for rejection
    const [rightPanelOpen, setRightPanelOpen] = useState(false);
    // Stores the rejection reason entered by the user
    const [rejectReason, setRejectReason] = useState("");
    // Stores the ID of the request selected for rejection
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
    // Controls visibility of the right panel for viewing rejection reason
    const [reasonPanelOpen, setReasonPanelOpen] = useState(false);
    // Stores the rejection reason to display
    const [viewReason, setViewReason] = useState<string>("");
    // Stores reporting lines (not used in this code)
    const [reportingLines, setReportingLines] = useState<any[]>([]);
    // Unused: stores selected start date
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    // Unused: stores selected end date
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    // Stores message for success or error (used for approval error)
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    // Controls visibility of the approve dialog
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    // Stores the ID of the request selected for approval
    const [approveTargetId, setApproveTargetId] = useState<number | null>(null);
    // Controls visibility of the approve success message
    const [showApproveSuccess, setShowApproveSuccess] = useState(false);
    // Controls visibility of the reject error message
    const [showRejectError, setShowRejectError] = useState(false);

    // Fetch user details for each unique user in the requests
    useEffect(() => {
        const uniqueUserIds = Array.from(new Set(requests.map(r => r.user.id)));
        uniqueUserIds.forEach(id => {
            if (typeof id === "number" && !userDetails[id] && token) {
                fetchUserById(id, token).then(u => {
                    setUserDetails(prev => ({ ...prev, [id]: u }));
                });
            }
        });
    }, [requests, token]);

    // Fetch reporting lines (not used in this component)
    useEffect(() => {
        if (!token) return;
        fetchReportingLines(token).then(setReportingLines);
    }, [token]);

    // Open approve dialog for a request
    const handleApprove = (requestId: number) => {
        setApproveTargetId(requestId);
        setApproveDialogOpen(true);
    };

    // Approve the selected leave request
    const doApprove = async () => {
        if (approveTargetId && token) {
            try {
                await approveLeaveRequest(approveTargetId, String(token));
                setApproveDialogOpen(false);
                setShowApproveSuccess(true);
            } catch (error) {
                setApproveDialogOpen(false);
                setMessage({ type: "error", text: "Failed to approve leave request." });
            }
        }
        return true;
    };

    // Open reject panel for a request
    const handleReject = (requestId: number) => {
        setSelectedRequestId(requestId);
        setRightPanelOpen(true);
        setRejectReason(""); 
    };

    // Reject the selected leave request
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
            {/* List all leave requests except cancelled ones */}
            {requests
                .filter(req => req.status !== "Cancelled")
                .map(req => {
                    let statusClass = "";
                    if (req.status === "Approved") statusClass = styles["status-approved"];
                    else if (req.status === "Rejected") statusClass = styles["status-rejected"];
                    else statusClass = styles["status-pending"];

                    const userId = req.user.id ?? 0;
                    const email = userDetails[userId]?.email;

                    return (
                        <div key={req.id} className={styles.listRow2}>
                            {/* Show email if admin and manager */}
                            {isAdmin && isManager && (
                                <div className={`${styles.listColumn2} ${styles.date}`}>
                                    {email}
                                </div>
                            )}
                            {/* Show leave request details */}
                            <div className={`${styles.listColumn2} ${styles.date} py-3`}>{req.startDate}</div>
                            <div className={`${styles.listColumn2} ${styles.date}`}>{req.endDate}</div>
                            <div className={`${styles.days}`}>{req.days}</div>
                            <div className={`${styles.listColumn2} ${styles.date}`}>
                                <span className={statusClass}>
                                    {req.status}
                                </span>
                            </div>
                            {/* Show view reason button if rejected */}
                            <div className={`${styles.listColumn2} ${styles.button}`}>
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

                            {/* Show approve/reject buttons for admin/manager in "all" mode */}
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

            {/* Approve dialog */}
            <ApproveDialog
                open={approveDialogOpen}
                onClose={() => setApproveDialogOpen(false)}
                title="Approve Leave Request"
                message="Are you sure you want to approve this leave request?"
                approveAction={doApprove}
            />

            {/* Success message for approval */}
            {showApproveSuccess && (
                <MessageDialog
                    type="success"
                    message="Leave approved!"
                    onClose={() => setShowApproveSuccess(false)}
                />
            )}

            {/* Right panel for entering rejection reason */}
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

            {/* Error message if reject reason is missing */}
            {showRejectError && (
                <MessageDialog
                    type="error"
                    message="Please provide a reason for rejection."
                    onClose={() => setShowRejectError(false)}
                />
            )}

            {/* Right panel for viewing rejection reason */}
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