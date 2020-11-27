import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { Grid, Avatar } from "@material-ui/core";
import { 
  makeStyles, 
  createMuiTheme, 
  MuiThemeProvider, 
  Theme 
} from "@material-ui/core/styles";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PolymerIcon from '@material-ui/icons/Polymer';

import { useSelector, useDispatch } from 'react-redux';
import { 
  selectLoginUser, 
  selectProfiles, 
  fetchAsyncGetMyProf, 
  fetchAsyncGetProfs, 
  fetchAsyncUpdateProf 
} from './features/auth/authSlice';
import { 
  fetchAsyncGetTasks, 
  fetchAsyncGetUsers, 
  fetchAsyncGetCategory, 
  selectEditedTask, 
  selectTasks 
} from './features/task/taskSlice'

import TaskList from './features/task/TaskList'
import TaskForm from './features/task/TaskForm'
import TaskDisplay from './features/task/TaskDisplay'

import { AppDispatch } from './app/store';

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "#3cb371",
    },
  },
});
const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    marginTop: theme.spacing(3),
    curson: "none",
  },
  avatar: {
    marginLeft: theme.spacing(1),
  }
}))

const App: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const editedTask = useSelector(selectEditedTask);
  const tasks = useSelector(selectTasks);
  const loginUser = useSelector(selectLoginUser);
  const profiles = useSelector(selectProfiles);

  const loginProfile = profiles.filter(
    (prof) => prof.user_profile === loginUser.id)[0];

  const Logout = () => {
    localStorage.removeItem('localJWT');
    window.location.href = "/";
  }

  const handlerEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput?.click();
  }

  useEffect(() => {
    const fetchBootLoader = async () => {
      await dispatch(fetchAsyncGetTasks());
      await dispatch(fetchAsyncGetMyProf());
      await dispatch(fetchAsyncGetUsers());
      await dispatch(fetchAsyncGetCategory());
      await dispatch(fetchAsyncGetProfs());
    };
    fetchBootLoader();
  }, [dispatch]);

  return (
    <MuiThemeProvider theme={theme}>
      <AppRoot>
        <Grid container>
          <Grid item xs={4}>
            <PolymerIcon className={classes.icon} />
          </Grid>
          <Grid item xs={4}>
            <h1>Scrum Task Board</h1>
          </Grid>
          <Grid item xs={4}>
            <AppLogout>
              <AppIconLogout 
                onClick={Logout}
              >
                <ExitToAppIcon fontSize="large" />
              </AppIconLogout>

              <input 
                type="file"
                id="imageInput"
                hidden={true}
                onChange={(e) => {
                    dispatch(
                      fetchAsyncUpdateProf({
                        id: loginProfile.id,
                        img: e.target.files !== null ? e.target.files[0] : null,
                      })
                    );
                  }
                }
              />
              <AppBtn
                onClick={handlerEditPicture}
              >
                <Avatar
                  className={classes.avatar}
                  alt="avatar"
                  src={
                    // loginProfileが存在する場合はimg属性を見に行く
                    loginProfile?.img !== null ? loginProfile?.img : undefined
                  }
                />
              </AppBtn>
            </AppLogout>
          </Grid>
          <Grid item xs={6}>
            {tasks[0]?.task && <TaskList/>}
          </Grid>
          <Grid item xs={6}>
            <Grid
              container
              direction="column"
              alignItems="center"
              justify="center"
              // style={{ minHeight: "80vh" }}
            >
              <Grid item>
                {editedTask.status ? <TaskForm /> : <TaskDisplay />}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </AppRoot>
    </MuiThemeProvider>
  );
}

export default App;

const AppRoot = styled.div`
  text-align: center;
  background-color: white;
  font-family: serif;
  color: dimgray;
  font-family: serif;
  margin: 25px;
`;

const AppIconLogout = styled.button`
  background-color: transparent;
  color: dimgray;
  margin-top: 4px;
  border: none;
  outline: none;
  cursor: pointer;
`;

const AppBtn = styled.button`
  background-color: transparent;
  padding-top: 3px;
  border: none;
  outline: none;
  cursor: pointer;
`;

const AppLogout = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
`;

