type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const Layout = ({ children, title }: LayoutProps) => {
  return (
    <div className="h-screen w-full flex items-center">
      <div className="w-1/2 bg-slate-600 h-full">
        <h3>{title}</h3>
      </div>
      <div className="w-1/2">{children}</div>
    </div>
  );
};
