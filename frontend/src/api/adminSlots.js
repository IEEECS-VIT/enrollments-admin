import api from "./admin";
import { auth } from "../../firebase";

export const createSlot = async (data) => {
  const token = await auth.currentUser.getIdToken();
  return api.post("/admin/create-slot", data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
