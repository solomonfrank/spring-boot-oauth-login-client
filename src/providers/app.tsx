import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router } from "react-router-dom";

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <Router>
      {children}
      <Toaster position="bottom-right" />
    </Router>
  );
};
