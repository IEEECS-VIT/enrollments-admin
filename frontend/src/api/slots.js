import api from "./admin";
import { auth } from "../../firebase";

export const getSlots = () => {
  return api.get("/slots/get-slots");
};

export const bookSlot = async (iid, time_slot) => {
  const token = await auth.currentUser.getIdToken();
  return api.post("/slots/post-slots", { iid, time_slot }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
