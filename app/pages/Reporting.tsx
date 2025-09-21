import { useAuth } from "../context/AuthContext";
import { Sidebar } from "../components/Sidebar";
import { fetchUsers, fetchUserById } from "../api/user";
import { useEffect, useState, useRef } from "react";
import type { UserSummary } from "~/types/UserType";
import styles from '~/styles/List.module.css';
import ProtectedRoute from "~/components/ProtectedPage";
import MessageDialog from "../components/MessageDialog";
import RightPanel from "../components/RightPanel";
import DeleteDialog from "../components/DeleteDialog";
import ReportingForm from "../components/reporting/ReportingForm";
import ReportingList from "../components/reporting/ReportingList";
import { fetchReportingLines, createReportingLine, updateReportingLine, deleteReportingLine } from "../api/reporting";

interface ReportingLine {
  id?: number;
  user_id: number;
  manager_id: number;
  startDate: string;
  endDate?: string;
  user?: UserSummary;     
  manager?: UserSummary;   
}

export default function Reporting() {
  const { user, token } = useAuth();

  const [users, setUsers] = useState<UserSummary[]>([]);
  const [reportingLines, setReportingLines] = useState<ReportingLine[]>([]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedReportingLine, setSelectedReportingLine] = useState<ReportingLine | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportingLineToDelete, setReportingLineToDelete] = useState<ReportingLine | null>(null);
  const [creating, setCreating] = useState(false);

  const reportingFormRef = useRef<any>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!token) return;

      const users = await fetchUsers(token);
      setUsers(users);

      const lines = await fetchReportingLines(token);


      const hydratedLines = await Promise.all(
        lines.map(async (line: any) => {
          let userObj = line.user;
          let managerObj = line.manager;
          if (!userObj || typeof userObj === "number") {
            userObj = await fetchUserById(line.user_id, token);
          }
          if (line.manager_id && (!managerObj || typeof managerObj === "number")) {
            managerObj = await fetchUserById(line.manager_id, token);
          }
          return {
            ...line,
            user: userObj,
            manager: managerObj,
          };
        })
      );
      setReportingLines(hydratedLines);
    };

    loadData();
  }, [token]);


  const managers = users.filter(u => (u as any).role?.name !== "staff");

  const handleSave = () => {
    reportingFormRef.current?.submitForm();
  };

  const handleFormSubmit = async (data: { user_id: number; manager_id: number; startDate: string; endDate?: string }) => {
    if (!token) return;
    try {
      if (creating) {
        await createReportingLine(token, data.user_id, data.manager_id, data.startDate, data.endDate);
        setMessage({ type: "success", text: "Reporting line created." });
      } else if (selectedReportingLine && selectedReportingLine.id) {
        await updateReportingLine(
          token,
          selectedReportingLine.id,
          data.user_id,
          data.manager_id,
          data.startDate,
          data.endDate ?? null // <-- fix: convert undefined to null
        );
        setMessage({ type: "success", text: "Reporting line updated." });
      }
      setEditing(false);
      setRightPanelOpen(false);
      setSelectedReportingLine(null);
      setCreating(false);

      const lines = await fetchReportingLines(token);
      setReportingLines(lines);
    } catch (error) {
      setMessage({ type: "error", text: creating ? "Failed to create reporting line." : "Failed to update reporting line." });
    }
  };

  const handleCreate = () => {
    setSelectedReportingLine({
      user_id: "" as any,
      manager_id: "" as any,
      startDate: new Date().toISOString().split('T')[0],
      endDate: ""
    });
    setEditing(true);
    setCreating(true);
    setRightPanelOpen(true);
  };

  // Removed handleViewDetails and handleEdit for details panel

  const handleEdit = (line: ReportingLine) => {
    setSelectedReportingLine(line);
    setEditing(true);
    setCreating(false);
    setRightPanelOpen(true);
  };

  const handleDelete = async (): Promise<boolean> => {
    if (!reportingLineToDelete || !token) return false;
    try {
      await deleteReportingLine(token, reportingLineToDelete.id!);
      setDeleteDialogOpen(false);
      setRightPanelOpen(false);
      setMessage({ type: "success", text: "Reporting line deleted." });
      const lines = await fetchReportingLines(token);
      setReportingLines(lines);
      return true;
    } catch {
      setMessage({ type: "error", text: "Failed to delete reporting line." });
      return false;
    }
  };

  const handleDeleteResult = async (success: boolean) => {
    if (success) {
      setMessage({ type: "success", text: "Reporting line deleted." });
      if (token) {
        const lines = await fetchReportingLines(token);
        setReportingLines(lines);
      }
    } else {
      setMessage({ type: "error", text: "Failed to delete reporting line." });
    }
  };

  return (
    <ProtectedRoute>
      {message && (
        <MessageDialog
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}
      <div className="flex w-full min-h-screen">
        {/* Sidebar: fixed/sticky, not flex-1 */}
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
        {/* Main content: flex-1, scrollable */}
        <div className="flex-1 p-6 overflow-auto">
          <div className={styles.listWrapper}>
            <div className="mb-25">
              <label className="page-title">Reporting Lines</label>
              <hr className="border-gray-300 my-1" />
              <p className="text-gray-700 mb-10 mt-3">
                Below is the list of reporting lines in your organisation.
              </p>
            </div>
            <div className="flex justify-end w-full mb-1">
              <button className="btn-primary px-15" onClick={handleCreate}>
                Create New Reporting Line
              </button>
            </div>
            <div className={styles.listHeader2}>
              <div className={`${styles.listColumn2} ${styles.email} `}>User Email</div>
              <div className={`${styles.listColumn2} ${styles.email} pl-4`}>Manager Email</div>
              <div className={`${styles.listColumn2} ${styles.date} pl-6`}>Start date</div>
              <div className={`${styles.listColumn2} ${styles.date} pl-5`}>End date</div>
              <div className={`${styles.listColumn2} ${styles.button}`}></div>
              <div className={`${styles.listColumn2} ${styles.button}`}></div>
            </div>
            {reportingLines.map(line => {
              if (!line.user || !line.manager) return null;
              return (
                <ReportingList
                  key={line.id}
                  user={line.user}
                  manager={line.manager}
                  startDate={line.startDate}
                  endDate={line.endDate}
                  onEdit={() => handleEdit(line)}
                  onDelete={() => {
                    setReportingLineToDelete(line);
                    setDeleteDialogOpen(true);
                  }}
                />
              );
            })}
          </div>
          <RightPanel
            open={rightPanelOpen}
            onClose={() => setRightPanelOpen(false)}
            title={
              creating
                ? "Create Reporting Line"
                : "Edit Reporting Line"
            }
            editing={true}
            // No editAction or deleteAction needed for details
            saveAction={handleSave}
            onCancel={() => {
              setEditing(false);
              setCreating(false);
              setRightPanelOpen(false);
              setSelectedReportingLine(null);
            }}
          >
            {selectedReportingLine && (
              <ReportingForm
                ref={reportingFormRef}
                users={users}
                managers={managers}
                onSubmit={handleFormSubmit}
                initial={{
                  user_id: selectedReportingLine.user?.id ?? selectedReportingLine.user_id,
                  manager_id: selectedReportingLine.manager?.id ?? selectedReportingLine.manager_id,
                  startDate: selectedReportingLine.startDate,
                  endDate: selectedReportingLine.endDate
                }}
              />
            )}
          </RightPanel>
          <div className="mt-50">
          {deleteDialogOpen && reportingLineToDelete && (
            <DeleteDialog
              title="Delete reporting line"
              message={`Are you sure you want to delete this reporting line?`}
              deleteAction={handleDelete}
              open={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
              onDeleteResult={handleDeleteResult}
            />
          )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
