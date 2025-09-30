import { useState, useEffect } from "react";
import DatePicker from "~/components/leave/DatePicker";
import ProtectedRoute from "~/components/ProtectedPage";
import { Sidebar } from "~/components/Sidebar";
import { useAuth } from "~/context/AuthContext";
import { fetchUserById } from "~/api/user";
import { fetchLeaveRequests } from "~/api/leave"; 
import LeaveRequestList from "~/components/leave/LeaveRequestList"; 
import styles from '~/styles/List.module.css';
import type { LeaveRequest } from "~/types/LeaveRequestType";

export default function MyLeave() {
    const { user, token } = useAuth();
    // Check if the current user is admin or manager
    const isAdmin = user?.token.role.name === "admin";
    const isManager = user?.token.role.name === "manager";

    // State for user's leave balance
    const [leaveBalance, setLeaveBalance] = useState<number>(0);
    // State to control showing the calendar (not used here)
    const [showCalendar, setShowCalendar] = useState(false);
    // State for all leave requests
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]); 

    // Fetch user's leave balance on mount or when user/token changes
    useEffect(() => {
        if (user?.token?.id && token) {
            fetchUserById(user.token.id, token)
                .then(fullUser => setLeaveBalance(fullUser.leaveBalance ?? 0))
                .catch(() => setLeaveBalance(0));
        }
    }, [user, token]);

    // Fetch all leave requests on mount or when token changes
    useEffect(() => {
        if (token) {
            fetchLeaveRequests(token)
                .then(data => {
                    const requests: LeaveRequest[] = Array.isArray(data)
                        ? data
                        : data
                        ? [data]
                        : [];
                    setLeaveRequests(requests);
                })
                .catch(() => setLeaveRequests([]));
        }
    }, [token]);

    return (
        <ProtectedRoute>
            <div className="flex w-full min-h-screen">
                {/* Sidebar with user profile info */}
                <Sidebar
                    profile={
                        user
                            ? {
                                firstName: user.token.firstName ?? "",
                                lastName: user.token.lastName ?? "",
                                email: user.token.email,
                                role: { id: user.token.role.id }
                            }
                            : undefined
                    }
                />
                <div className="flex-1 p-6" >
                    <div className={styles.listWrapper}>
                        <div className="pb-9">
                            {/* Page title and welcome message */}
                            <label className="page-title">Manage staff leave requests</label>
                            <hr className="border-gray-300 my-1" />
                            <p className="text-gray-700 mb-4 mt-3">
                                Welcome to the Manage staff leave requests page. This is where you can view and manage leave requests.
                            </p>
                        </div>

                        <div className="mt-10">
                            {/* Leave requests list header */}
                            <div className={`${styles.listHeader} mt-pt-6 pl-13`}>
                                {(isAdmin || isManager) && <div className={`${styles.listColumn2} ${styles.date}`}>User Email</div>}
                                <div className={`${styles.listColumn2} ${styles.date}`}>Start Date</div>
                                <div className={`${styles.listColumn2} ${styles.date}`}>End Date</div>
                                <div className={`${styles.days}`}>Days</div>
                                <div className={`${styles.listColumn2} ${styles.date} pl-3`}>Status</div>
                                <div className={`${styles.listColumn2} ${styles.button}`}></div>
                                <div className={`${styles.listColumn2} ${styles.button}`}></div>
                                <div className={`${styles.listColumn2} ${styles.button}`}></div>
                            </div>
                            {/* List of all leave requests */}
                            <LeaveRequestList requests={leaveRequests} type="all" /> 
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}