"use client";
import { IconButton, Snackbar } from "@mui/joy";
import { createContext, ReactNode, useContext, useState } from "react";
import { IoIosClose } from "react-icons/io";

const SnackbarContext = createContext({
  showSnackbar: (_message: string) => {},
});

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const showSnackbar = (msg: string) => {
    setMessage(msg);
    setOpen(true);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        variant="outlined"
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

export const useSnackbar = () => useContext(SnackbarContext);
