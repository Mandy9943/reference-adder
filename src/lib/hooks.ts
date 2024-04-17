import { ChangeEvent, useState } from "react";

export const useForm = () => {
  const [state, setState] = useState({
    mainText: "",
    references: "",
  });
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  return {
    form: state,
    handleChange,
  };
};
