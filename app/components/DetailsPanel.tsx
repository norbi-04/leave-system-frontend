interface DetailsPanelProps {
    children: React.ReactNode;
}

export default function DetailsPanel({ children }: DetailsPanelProps) {
    return (
    <div className="bg-gray-100 p-6 rounded-lg shadow h-full">
      {children}
    </div>
  );
}