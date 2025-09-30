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
    // Check if the current user is an admin
    const isAdmin = user?.token.role.name === "admin";

    // State for user's leave balance
    const [leaveBalance, setLeaveBalance] = useState<number>(0);
    // State for user's leave requests
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]); 

    // Refetch leave requests after a new request is created
    const refetch = async () => {
        const data = await fetchLeaveRequests(String(token));
        setLeaveRequests(data);
    };

    // Fetch user's leave balance on mount or when user/token changes
    useEffect(() => {
        if (user?.token?.id && token) {
            fetchUserById(user.token.id, token)
                .then(fullUser => setLeaveBalance(fullUser.leaveBalance ?? 0))
                .catch(() => setLeaveBalance(0));
        }
    }, [user, token]);

    // Fetch user's leave requests on mount or when token changes
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
                        <div className="pb-3">
                            {/* Page title and welcome message */}
                            <label className="page-title">My leave</label>
                            <hr className="border-gray-300 my-1" />
                            <p className="text-gray-700 mb-4 mt-3">
                                Welcome to the My leave page.
                            </p>
                        </div>
                        
                        <div className="flex flex-row w-full gap-10 mt-4">
                            <div className="w-full">
                                {/* Leave request calendar */}
                                <h1 className="heading">Your Calendar</h1>
                                <p className="text-gray-700 texxt-sm mb-4 mt-3">
                                    Select a date range to request leave. Dates already booked or pending approval can't be selected.
                                </p>
                                <DatePicker leaveRequests={leaveRequests} leaveBalance={leaveBalance} onLeaveRequestCreated={refetch} />
                            </div>
                        </div>
                 
                        <div className="mt-10">
                            {/* Leave requests list */}
                            <h1 className="heading">Your leave requests</h1>
                            <p className="text-gray-700 texxt-sm mb-4 mt-3">
                                Below is a list of your leave requests. You can see the status of each request.
                            </p>
                            <div className={`${styles.listHeader} mt-pt-6 pl-13`}>
                                {/* Show user email column if admin */}
                                {isAdmin && <div className={`${styles.listColumn2} ${styles.date}`}>User Email</div>}
                                <div className={`${styles.listColumn2} ${styles.date}`}>Start Date</div>
                                <div className={`${styles.listColumn2} ${styles.date}`}>End Date</div>
                                <div className={`${styles.days}`}>Days</div>
                                <div className={`${styles.listColumn2} ${styles.date} pl-3`}>Status</div>
                                <div className={`${styles.listColumn2} ${styles.button}`}></div>
                                {/* <div className={`${styles.listColumn2} ${styles.button}`}></div> */}
                                {/* <div className={`${styles.listColumn2} ${styles.button}`}></div> */}
                            </div>
                            <LeaveRequestList requests={leaveRequests} type="my" /> 
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}