type DashboardHeaderProps = {
  heading: string;
  text?: string;
};

export default function DashboardHeader({
  heading,
  text,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b pb-6">
      <div className="grid gap-1">
        <h1 className="font-bold text-3xl md:text-4xl">{heading}</h1>
        {text && <p className="text-lg text-muted-foreground">{text}</p>}
      </div>
    </div>
  );
}
