import { Bounce, toast } from "react-toastify";

export const toastError = (message: string) =>
  toast.error(message, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: localStorage.getItem("theme") === "dark" ? "dark" : "light",
    transition: Bounce,
  });

export const toastSuccess = (message: string) =>
  toast.success(message, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: localStorage.getItem("theme") === "dark" ? "dark" : "light",
    transition: Bounce,
  });

export const toastWarning = (message: string) =>
  toast.warning(message, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: localStorage.getItem("theme") === "dark" ? "dark" : "light",
    transition: Bounce,
  });

export const toastInfo = (message: string) =>
  toast.info(message, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: localStorage.getItem("theme") === "dark" ? "dark" : "light",
    transition: Bounce,
  });
