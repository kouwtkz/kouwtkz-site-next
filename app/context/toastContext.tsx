"use client";

// サードパーティのライブラリを使う(reactのライブラリが使えるのでかいなあ)
// https://react-hot-toast.com/
import { Toaster } from "react-hot-toast";

// Toast
const ToasterContext = () => {
  return <Toaster containerClassName="toast" />;
};

export default ToasterContext;
