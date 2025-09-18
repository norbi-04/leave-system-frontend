interface DetailsPanelProps {
  title: string;
  children: React.ReactNode;
}

export default function DetailsPanel({ title, children }: DetailsPanelProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg h-full flex flex-col">
      <h2 className="font-semibold text-xl mb-6 py-2">{title}</h2>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
