type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-6 relative border-l-4 border-military-500 pl-4 py-1">
      <h1 className="text-3xl font-black tracking-widest uppercase text-slate-100 drop-shadow-md decoration-military-500">{title}</h1>
      {description ? (
        <p className="mt-2 text-sm font-mono text-slate-400 max-w-2xl">{description}</p>
      ) : null}
    </div>
  );
}