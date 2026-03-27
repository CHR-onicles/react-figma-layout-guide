import { redirect, type LoaderFunction } from "react-router";

export const clientLoader: LoaderFunction = async () => {
  return redirect("/");
};
