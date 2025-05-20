"use client";

import { IconButton, Snackbar } from "@mui/joy";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { IoIosClose } from "react-icons/io";

type SnackbarStatus = "primary" | "success" | "danger" | "warning";

type SnackbarContextType = {
  showSnackbar: (msg: string, status?: SnackbarStatus) => void;
};

const SnackbarContext = createContext({} as SnackbarContextType);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<SnackbarStatus>("primary");
  const [open, setOpen] = useState(false);

  const showSnackbar = (msg: string, status: SnackbarStatus = "primary") => {
    setMessage(msg);
    setStatus(status);
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setOpen(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        variant="outlined"
        color={status}
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        endDecorator={
          <IconButton variant="plain" onClick={() => setOpen(false)}>
            <IoIosClose fontSize={20} />
          </IconButton>
        }
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbarContext = () => useContext(SnackbarContext);
