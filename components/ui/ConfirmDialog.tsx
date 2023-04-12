import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { startDeletingPost } from "@/store/post/thunks";
import { useEffect } from "react";
import { store, RootState } from "@/store";
import Swal from "sweetalert2";
import { Post } from "@/interfaces/post";
import { setSaving } from "@/store/post/postSlice";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface ConfirmDialogProps {
  onClose: () => void;
  title: string;
  message: string;
  open: boolean;
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
  const dispatch = useDispatch();
  const {
    active: post,
    titleMessageSaved,
    messageSaved,
  } = useSelector((state: RootState) => state.post);

  const handleConfirmDeletePost = () => {
    store.dispatch(startDeletingPost());
  };

  useEffect(() => {
    if (
      titleMessageSaved != null &&
      messageSaved !== null &&
      messageSaved.length > 0
    ) {
      Swal.fire(titleMessageSaved, messageSaved, "success");
      props.onClose();
      dispatch(setSaving());
    }
  }, [messageSaved]);

  return (
    <Dialog
      open={props.open}
      TransitionComponent={Transition}
      keepMounted
      onClose={props.onClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {props.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={props.onClose}>
          Disagree
        </Button>
        <Button variant="contained" onClick={handleConfirmDeletePost}>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}
