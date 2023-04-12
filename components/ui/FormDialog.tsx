import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import { ErrorOutline, SaveOutlined } from "@mui/icons-material";

import { useForm } from "react-hook-form";

import { Post } from "@/interfaces/post";
import { store, RootState } from "@/store";
import {
  startAddPost,
  startLoadingPosts,
  startSavePost,
} from "@/store/post/thunks";
import Swal from "sweetalert2";
import { setSaving } from "@/store/post/postSlice";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface FormDialogProps {
  onClose: () => void;
  title: string;
  open: boolean;
  postToCreateUpdate: Post | undefined;
}

type FormData = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

const FormDialog = (props: FormDialogProps) => {
  const dispatch = useDispatch();
  const {
    active: post,
    titleMessageSaved,
    messageSaved,
    isSaving,
    posts,
  } = useSelector((state: RootState) => state.post);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: props.postToCreateUpdate,
  });
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const subcription = watch((value, { name, type }) => {});

    return () => {
      subcription.unsubscribe();
    };
  }, [watch, setValue]);

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

  const onSavePost = async (postToSave: FormData) => {
    try {
      if (!postToSave?.id) {
        const postToCreate = {
          id: 0,
          title: postToSave.title,
          body: postToSave.body,
          userId: 1,
        };

        if (posts != null && posts.length > 0) {
          postToCreate.id = posts.length + 1;
        } else {
          store.dispatch(startLoadingPosts());
        }
        store.dispatch(startAddPost(postToCreate));
      } else {
        store.dispatch(startSavePost(postToSave));
      }

      setShowError(false);
    } catch (error) {
      console.log("Error editing post");
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  };

  return (
    <Box>
      <Dialog
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={props.onClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <form onSubmit={handleSubmit(onSavePost)}>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogContent>
            <Box sx={{ width: 350, padding: "10px 20px" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Chip
                    label="Error"
                    color="error"
                    icon={<ErrorOutline />}
                    className="fadeIn"
                    sx={{ display: showError ? "flex" : "none" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Id"
                    value={props.postToCreateUpdate?.id}
                    fullWidth
                    disabled
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Title"
                    fullWidth
                    variant="filled"
                    {...register("title", {
                      required: "Este campo es requerido",
                      minLength: { value: 2, message: "Mínimo 2 caracteres" },
                    })}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    fullWidth
                    variant="filled"
                    {...register("body", {
                      required: "Este campo es requerido",
                      minLength: { value: 2, message: "Mínimo 2 caracteres" },
                    })}
                    error={!!errors.body}
                    helperText={errors.body?.message}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={props.onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              <SaveOutlined sx={{ fontSize: 30, mr: 1 }} />
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default FormDialog;
