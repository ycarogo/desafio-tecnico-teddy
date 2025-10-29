import { ToastContainer } from "react-toastify";

const LayoutPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ToastContainer />
      <div>{children}</div>
    </>
  );
};

export default LayoutPage;
