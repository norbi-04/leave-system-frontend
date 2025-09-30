import { useState, useEffect } from "react";
import { Day, DayPicker } from "react-day-picker";
import styles from '~/styles/DatePicker.module.css';
import { addMonths, differenceInCalendarDays, parseISO, format } from "date-fns";
import { createLeaveRequest } from "~/api/leave";
import { fetchUserById } from "~/api/user";
import { fetchReportingLines } from "~/api/reporting";
import MessageDialog from "~/components/MessageDialog"; 
import { useAuth } from "~/context/AuthContext";
import type { LeaveRequest } from "~/types/LeaveRequestType";

// https://daypicker.dev/docs/selection-modes

interface DatePickerProps {
    leaveRequests: LeaveRequest[];
    leaveBalance: number;
    onLeaveRequestCreated?: () => void;
}

export default function DatePicker({ leaveRequests, leaveBalance, onLeaveRequestCreated }: DatePickerProps) {
    const { user, token } = useAuth();
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const today = new Date();
    const [month, setMonth] = useState<Date>(today);

    // calculating number of selected days
    const daysSelected =
        startDate && endDate
            ? differenceInCalendarDays(endDate, startDate) + 1
            : 0;

    // success/error messages state
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    // reporting lines state
    const [reportingLines, setReportingLines] = useState<any[]>([]);

    // approved leave date ranges
    const approvedRanges = leaveRequests
        .filter(req => req.status === "Approved")
        .map(req => ({
            from: parseISO(req.startDate),
            to: parseISO(req.endDate)
        }));

    // pending leave date ranges
    const pendingRanges = leaveRequests
        .filter(req => req.status === "Pending")
        .map(req => ({
            from: parseISO(req.startDate),
            to: parseISO(req.endDate)
        }));

    // calendar styling
    const modifiers = {
        approved: approvedRanges,
        pending: pendingRanges
    };

    const modifiersClassNames = {
        approved: styles["rdp-approved"],
        pending: styles["rdp-pending"]    
    };

    // leave request submission
    const handleRequestLeave = () => {
        if (startDate && endDate) {
            // user's reporting line (manager)
            const myReportingLine = reportingLines.find(
                (line) =>
                    line.user &&
                    Number(line.user.id) === Number(user?.token.id) &&
                    line.manager &&
                    typeof line.manager.id !== "undefined"
            );
            const managerId = myReportingLine ? Number(myReportingLine.manager.id) : undefined;
            const userId = user?.token.id ? String(user.token.id) : undefined;

            // debug logs
            // console.log("Reporting lines:", reportingLines);
            // console.log("Current user id:", user?.token.id);
            // console.log("Found reporting line:", myReportingLine);
            // console.log("Manager ID to send:", managerId);

            // create leave request
            createLeaveRequest(startDate, endDate, String(token), userId, managerId)
                .then(() => {
                    setMessage({ type: "success", text: 'Leave request created successfully!' });
                    setStartDate(undefined);
                    setEndDate(undefined);
                    if (onLeaveRequestCreated) onLeaveRequestCreated();
                })
                .catch((error) => {
                    console.error('Error creating leave request:', error);
                    setMessage({ type: "error", text: 'Failed to create leave request. Please try again.' });
                });
        }
    }

    // disabled dates for selection (approved or pending)
    const disabledDates: Date[] = [];
    leaveRequests.forEach(req => {
        if (req.status === "Approved" || req.status === "Pending") {
            const from = toDateOnly(req.startDate);
            const to = toDateOnly(req.endDate);
            for (
                let date = new Date(from);
                date <= to;
                date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
            ) {
                disabledDates.push(new Date(date));
            }
        }
    });

    function isRangeOverlapping(rangeFrom: Date, rangeTo: Date, disabledDates: Date[]) {
        for (
            let date = new Date(rangeFrom);
            date <= rangeTo;
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
        ) {
            if (disabledDates.some(disabled =>
                disabled.getFullYear() === date.getFullYear() &&
                disabled.getMonth() === date.getMonth() &&
                disabled.getDate() === date.getDate()
            )) {
                return true;
            }
        }
        return false;
    }

    function toDateOnly(dateString: string) {
      const d = parseISO(dateString);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    const startDateString = startDate ? format(startDate, "yyyy-MM-dd") : "";
    const endDateString = endDate ? format(endDate, "yyyy-MM-dd") : "";

    useEffect(() => {
        if (!token) return;
        fetchReportingLines(token).then(data => {
            console.log("Fetched reporting lines:", data);
            setReportingLines(data);
        });
    }, [token]);

    return (
        <div className="flex flex-row min-h-[660px] shadow-sm border-gray-200 bg-zinc-50">
            {/* Calendar Section */}
            <div className="flex flex-col justify-top w-full bg-white-50">
                <h2 className="text-xl font-semibold pl-4 pt-2">Select Leave Dates</h2>
                <DayPicker
                    mode="range"
                    selected={startDate && endDate ? { from: startDate, to: endDate } : undefined}
                    onSelect={(range) => {
                        if (range && range.from && range.to) {
                            // Prevent selecting overlapping leave
                            if (isRangeOverlapping(range.from, range.to, disabledDates)) {
                                setMessage({ type: "error", text: "Selected range overlaps with existing leave (pending or approved)." });
                                setStartDate(undefined);
                                setEndDate(undefined);
                                return;
                            }
                            setStartDate(range.from);
                            setEndDate(range.to);
                        } else {
                            setStartDate(undefined);
                            setEndDate(undefined);
                        }
                    }}
                    month={month}
                    onMonthChange={setMonth}
                    classNames={{
                        root: styles["rdp-root"],
                        day: styles["rdp-day"],
                        day_button: styles["rdp-day_button"],
                        caption_label: styles["rdp-caption_label"],
                        button_next: styles["rdp-button_next"],
                        button_previous: styles["rdp-button_previous"],
                        chevron: styles["rdp-chevron"],
                        dropdowns: styles["rdp-dropdowns"],
                        dropdown: styles["rdp-dropdown"],
                        month_caption: styles["rdp-month_caption"],
                        months: styles["rdp-months"],
                        month_grid: styles["rdp-month_grid"],
                        nav: styles["rdp-nav"],
                        weekday: styles["rdp-weekday"],
                        week_number: styles["rdp-week_number"],
                        selected: styles["rdp-selected"],
                        outside: styles["rdp-outside"],
                        disabled: styles["rdp-disabled"],
                        today: styles["rdp-today"],
                        range_start: styles["rdp-range_start"],
                        range_middle: styles["rdp-range_middle"],
                        range_end: styles["rdp-range_end"],
                    }}
                    showOutsideDays
                    disabled={[
                        { before: today },
                        ...disabledDates
                    ]}
                    modifiers={modifiers}
                    modifiersClassNames={modifiersClassNames}
                />
            </div>
            {/* Controls Section */}
            <div className="flex flex-col border-l border-gray-200 p-4 bg-gray-50 w-2/5">
                {/* <h2 className="text-xl font-semibold">Leave Actions</h2> */}
                <div className="flex flex-col h-full flex-1">
                    <div className="flex flex-col border-b border-gray-200 space-y-2 pb-10">
                        <h1 className="text-lg font-semibold">Calander Actions</h1>
                        <button
                            className="btn-secondary w-full"
                            onClick={() => setMonth(today)}
                        >
                            Go to today
                        </button>
                        <button
                            className="btn-secondary-transparent w-full"
                            onClick={() => { setStartDate(undefined); setEndDate(undefined); }}
                        >
                            Reset Selection
                        </button>
                        
                    </div>
                    <div className="flex flex-col pt-4  ">
                        <div className="pb- mb-4 px-1">
                            <div className="border-b border-gray-200 pb-4 mb-2">
                            <h2 className="text-lg font-semibold">Leave Balance</h2>
                            <p className="flex justify-end text-4xl font-medium text-gray-700">
                              {leaveBalance} <span className="text-lg font-normal ml-2 pt-3 ">days</span>
                            </p>
                            </div>
                            <div className="flex flex-col ">
                            {daysSelected > 0 && (
                              <div className="flex flex-col gap-2">
                                <div className="flex flex-row gap-4 border-b border-gray-200 pb-2">
                                  <p className="text-sm text-gray-700 flex-1">
                                  Available leave:
                                  </p>
                                  <p className="text-sm text-gray-600 text-right w-24">
                                    {leaveBalance} days
                                  </p>
                                </div>
                                <div className="flex flex-row gap-4 border-b border-gray-400 pb-2">
                                  <p className="text-sm text-gray-700 flex-1">
                                  Selected number of days:
                                  </p>
                                  <p className="text-sm text-gray-600 text-right w-24">
                                    - {daysSelected} days
                                  </p>
                                </div>
                                <div className="flex flex-row gap-4">
                                  <p className="text-sm text-gray-700 flex-1">
                                   Leave balance after request:
                                  </p>
                                  <p className="text-sm text-gray-600 text-right w-24">
                                    {leaveBalance - daysSelected} days
                                  </p>
                                </div>
                              </div>
                            )}
                            </div>
                        </div>
                    </div>
                    {daysSelected > 0 && (
                        // Bottom-aligned section
                        <div className="mt-auto flex flex-col space-y-2 pt-4">
                            {startDate && endDate && (
                                <div className="bg-white-50 mb-5">
                                    <label className="label pl-3">
                                      Date format: DD/MM/YYYY
                                    </label>
                                    <p className="text-left text-teal-700 font-semibold text-base rounded px-3 py-1">
                                      Selected Start Date: {startDate.toLocaleDateString("en-GB")} <br />
                                      Selected End Date: {endDate.toLocaleDateString("en-GB")}
                                    </p>
                                  </div>
                            )}
                            <button className="btn-primary w-full justify-end " onClick={handleRequestLeave}>Request Selected Leave</button>
                        </div>
                    )}
                </div>
            </div>
            {/* message dialog */}
            {message && (
                <MessageDialog
                    type={message.type}
                    message={message.text}
                    onClose={() => setMessage(null)}
                />
                )}
        </div>
    );
}