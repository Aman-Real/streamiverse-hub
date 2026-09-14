import { useContext } from "react";
import { MyListContext } from "@/features/my-list/context/MyListContext";

export const useMyList = () => {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error("useMyList must be used inside <MyListProvider>");
  }
  return context;
};
