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

// Reporting line type for this page
interface ReportingLine {
  id?: number;
  user_id: number;
  manager_id: number;
  startDate: string;
  endDate?: string;
  user?: UserSummary;     // Hydrated user object
  manager?: UserSummary;  // Hydrated manager object
}

export default function Reporting() {
  const { user, token } = useAuth();
  const isAdmin = user?.token.role.name === "admin";

  // List of all users
  const [users, setUsers] = useState<UserSummary[]>([]);
  // List of all reporting lines
  const [reportingLines, setReportingLines] = useState<ReportingLine[]>([]);
  // State for showing success/error messages
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // State for right panel (create/edit)
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedReportingLine, setSelectedReportingLine] = useState<ReportingLine | null>(null);
  // State for delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportingLineToDelete, setReportingLineToDelete] = useState<ReportingLine | null>(null);
  // State for create mode
  const [creating, setCreating] = useState(false);

  // Ref for ReportingForm to trigger submit from parent
  const reportingFormRef = useRef<any>(null);

  // Fetch users and reporting lines on mount or when token changes
  useEffect(() => {
    const loadData = async () => {
      if (!token) return;

      // Fetch all users
      const users = await fetchUsers(token);
      setUsers(users);

      // Fetch all reporting lines
      const lines = await fetchReportingLines(token);

      // Hydrate reporting lines with user/manager objects
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

  // Filter users to get managers (not staff)
  const managers = users.filter(u => (u as any).role?.name !== "staff");

  // Handle save button in right panel (calls form submit)
  const handleSave = () => {
    reportingFormRef.current?.submitForm();
  };

  // Handle form submit for create or update
  const handleFormSubmit = async (data: { user_id: number; manager_id: number; startDate: string; endDate?: string }) => {
    if (!token) return;
    try {
      if (creating) {
        // Create new reporting line
        await createReportingLine(token, data.user_id, data.manager_id, data.startDate, data.endDate);
        setMessage({ type: "success", text: "Reporting line created." });
      } else if (selectedReportingLine && selectedReportingLine.id) {
        // Update existing reporting line
        await updateReportingLine(
          token,
          selectedReportingLine.id,
          data.user_id,
          data.manager_id,
          data.startDate,
          data.endDate ?? null 
        );
        setMessage({ type: "success", text: "Reporting line updated." });
      }
      setEditing(false);
      setRightPanelOpen(false);
      setSelectedReportingLine(null);
      setCreating(false);

      // Refresh reporting lines
      const lines = await fetchReportingLines(token);
      setReportingLines(lines);
    } catch (error) {
      setMessage({ type: "error", text: creating ? "Failed to create reporting line." : "Failed to update reporting line." });
    }
  };

  // Open right panel for creating a new reporting line
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

  // Open right panel for editing a reporting line
  const handleEdit = (line: ReportingLine) => {
    setSelectedReportingLine(line);
    setEditing(true);
    setCreating(false);
    setRightPanelOpen(true);
  };

  // Handle delete action for a reporting line
  const handleDelete = async (): Promise<boolean> => {
    if (!reportingLineToDelete || !token) return false;
    try {
      await deleteReportingLine(token, reportingLineToDelete.id!);
      setDeleteDialogOpen(false);
      setRightPanelOpen(false);
      setMessage({ type: "success", text: "Reporting line deleted." });
      // Refresh reporting lines
      const lines = await fetchReportingLines(token);
      setReportingLines(lines);
      return true;
    } catch {
      setMessage({ type: "error", text: "Failed to delete reporting line." });
      return false;
    }
  };

  // Handle result of delete dialog
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
      {/* Show message dialog if needed */}
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
            <div className="mb-0">
              {/* Page title and description */}
              <label className="page-title">Reporting Lines</label>
              <hr className="border-gray-300 my-1" />
              <p className="text-gray-700 mb-10 mt-3">
                Below is the list of reporting lines in your organisation.
              </p>
            </div>
            {/* Show create button for admins */}
            {isAdmin && (
            <div className="flex justify-end w-full mb-1">
              <button className="btn-primary px-15" onClick={handleCreate}>
                Create New Reporting Line
              </button>
            </div>
            )}
            {/* List header */}
            <div className={styles.listHeader2}>
              <div className={`${styles.listColumn2} ${styles.email} `}>User Email</div>
              <div className={`${styles.listColumn2} ${styles.email} pl-4`}>Manager Email</div>
              <div className={`${styles.listColumn2} ${styles.date} pl-6`}>Start date</div>
              <div className={`${styles.listColumn2} ${styles.date} pl-5`}>End date</div>
              <div className={`${styles.listColumn2} ${styles.button}`}></div>
              <div className={`${styles.listColumn2} ${styles.button}`}></div>
            </div>
            {/* List of reporting lines */}
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
          {/* Right panel for create/edit reporting line */}
          <RightPanel
            open={rightPanelOpen}
            onClose={() => setRightPanelOpen(false)}
            saveTitle="Save Changes"
            cancelTitle="Cancel Changes"
            title={
              creating
                ? "Create Reporting Line"
                : "Edit Reporting Line"
            }
            editing={true}
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
          {/* Delete dialog for reporting line */}
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
