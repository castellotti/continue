import { createAsyncThunk } from "@reduxjs/toolkit";
import { clearLastEmptyResponse, setInactive } from "../slices/sessionSlice";
import { ThunkApiType } from "../store";
import { saveCurrentSession } from "./session";
import { setDialogMessage, setShowDialog } from "../slices/uiSlice";
import StreamErrorDialog from "../../pages/gui/StreamError";

export const streamThunkWrapper = createAsyncThunk<
  void,
  () => Promise<void>,
  ThunkApiType
>("chat/streamWrapper", async (runStream, { dispatch, extra }) => {
  try {
    await runStream();
  } catch (e: unknown) {
    dispatch(clearLastEmptyResponse());
    dispatch(setDialogMessage(<StreamErrorDialog error={e} />));
    dispatch(setShowDialog(true));
  } finally {
    dispatch(setInactive());
    await dispatch(
      saveCurrentSession({
        openNewSession: false,
      }),
    );
  }
});
