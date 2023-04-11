import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Typography,
  Grid,
  useTheme,
  Toolbar,
  InputBase,
  Divider,
  Paper,
  TableFooter,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { Post } from '@/interfaces/post';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ConfirmDialog, { ConfirmDialogProps } from '../ui/ConfirmDialog';
import FormDialog, { FormDialogProps } from '../ui/FormDialog';
import Box from '@mui/material/Box';
import {
  AddOutlined,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import SearchIcon from '@mui/icons-material/Search';

import { RootState } from '@/store';
import { startLoadingPosts } from '@/store/post/thunks';
import { filterPost, setActivePost } from '@/store/post/postSlice';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { setTextFilter, resetTextFilter } from '@/store/post/postFilterSlice';

interface PostTableProps {
  postList: Post[];
}

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const PostTable: React.FC<PostTableProps> = ({ postList }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const dispatch = useDispatch();
  const {
    active: post,
    isSaving,
    posts,
  } = useSelector((state: RootState) => state.post);

  const { textFilter } = useSelector((state: RootState) => state.postFilter);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, postList.length - page * rowsPerPage);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  function toggleConfirmDialog(post: Post) {
    setOpenConfirmDialog(!openConfirmDialog);
    dispatch(setActivePost(post));
  }

  const confirmDialogProps: ConfirmDialogProps = {
    onClose: toggleConfirmDialog,
    title: 'Delete post',
    message: 'Are you sure you want to delete this post?',
    open: openConfirmDialog,
  };

  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [postSelected, setPostSelected] = useState();

  function toggleFormDialog(post: Post) {
    setOpenFormDialog(!openFormDialog);
    setPostSelected(post);
    dispatch(setActivePost(post));
  }

  const formDialogProps: FormDialogProps = {
    onClose: toggleFormDialog,
    title: 'Edit post',
    open: openFormDialog,
    postToUpdate: postSelected,
  };

  const onAddPost = () => {
    setOpenFormDialog(!openFormDialog);
  };

  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  const handleFilterPost = (value: string) => {
    dispatch(setTextFilter({ textFilter: value.trimStart() }));
    setIsEmpty(value.replace(/\s/g, '') === '');
  };

  const handleSubmit = () => {
    try {
      if (textFilter !== null || textFilter !== '') {
        dispatch(filterPost(textFilter));
      }
    } catch (error) {
      console.log('Error search post');
    }
  };

  const resetFilter = () => {
    dispatch(resetTextFilter());
    dispatch(startLoadingPosts());
  };

  return (
    <Box>
      <Toolbar>
        <Typography variant="h5" noWrap component="div">          
          Admin Posts
        </Typography>
        <Paper
          component="form"
          onSubmit={(e) => e.preventDefault()}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: 400,
            ml: '435px',
          }}
        >
          <InputBase
            sx={{ p: '5px', ml: 1, flex: 1 }}
            placeholder="Search post"
            key="textFilter"
            name="textFilter"
            value={textFilter}
            onChange={(e) => handleFilterPost(e.target.value)}
          />

          <IconButton
            sx={{ p: '10px' }}
            aria-label="search"
            onClick={handleSubmit}
            disabled={textFilter === ''}
          >
            <SearchIcon />
          </IconButton>

          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

          <IconButton
            sx={{ p: '10px' }}
            aria-label="search-off"
            onClick={resetFilter}
            disabled={textFilter === ''}
          >
            <SearchOffIcon />
          </IconButton>
        </Paper>

        <IconButton
          onClick={onAddPost}
          size="large"
          disabled={isSaving}
          sx={{
            color: 'white',
            backgroundColor: 'grey',
            ':hover': { backgroundColor: 'grey', opacity: 0.9 },
            position: 'absolute',
            right: 55,
            top: 10,
          }}
        >
          <AddOutlined sx={{ fontSize: 20 }} />
        </IconButton>
      </Toolbar>

      <Box>{post && <FormDialog {...formDialogProps} />}</Box>

      <Grid
        className="animate__animated animate__fadeIn animate__faster"
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          minHeight: 'calc(100vh - 110px)',
          backgroundColor: '#80808099',
          borderRadius: 3,
          width: '97%',
          marginLeft: '15px',
          marginRight: '15px',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h5" component={'h5'}>
                  ID
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h5" component={'h5'}>
                  Title
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h5" component={'h5'}>
                  Description
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h5" component={'h5'}>
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? posts.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : posts
            ).map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.id}</TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.body}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => toggleFormDialog(post)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => toggleConfirmDialog(post)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={3}
                count={posts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
        {openConfirmDialog && <ConfirmDialog {...confirmDialogProps} />}
        {openFormDialog && <FormDialog {...formDialogProps} />}
      </Grid>
    </Box>
  );
};

export default PostTable;
