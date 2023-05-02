import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faCircleDot,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import httpReqWithToken from "../../helpers/httpReqWithToken";

function TaskItem({ id, title, deleteHandler, toggleUpdate }) {
  const [isEdit, setIsEdit] = useState(false);
  const {
    register,
    reset,
    formState: { errors },
    getValues,
  } = useForm();

  const editInputHandler = () => {
    setIsEdit((prevEdit) => !prevEdit);
  };

  const editReqHandler = async (event) => {
    if (event.key === "Enter") {
      const title = getValues("title");
      reset();
      try {
        const taskRes = await httpReqWithToken.put(`/tasks/${id}`, {
          title,
        });
        const { statusCode, success, message } = taskRes.data;
        if (statusCode === 200 && success === true) {
          toast(message);
          toggleUpdate();
        }
      } catch (err) {
        console.log(err);
      }
      setIsEdit(false);
    }
  };

  return (
    <div className="bg-white flex py-2.5 px-5 my-4 rounded-md shadow-md">
      <div className="mr-3">
        <FontAwesomeIcon icon={faCircleDot} style={{ color: "#756E6E" }} />
      </div>
      <div className="flex-1">
        {isEdit ? (
          <input
            {...register("title")}
            className="w-full focus:outline-none"
            autoFocus
            type="text"
            placeholder={title}
            onKeyDown={editReqHandler}
          />
        ) : (
          <h5>{title}</h5>
        )}
      </div>
      <div
        onClick={editInputHandler}
        className="w-7 mx-3 flex items-center justify-center cursor-pointer"
      >
        <FontAwesomeIcon icon={faPenToSquare} style={{ color: "#63BC6C" }} />
      </div>
      <div
        onClick={deleteHandler}
        className="w-7 flex items-center justify-center cursor-pointer"
      >
        <FontAwesomeIcon icon={faTrash} style={{ color: "#E17070" }} />
      </div>
      {errors.title && (
        <small className="text-red-400 capitalize">
          {errors.title.message}
        </small>
      )}
    </div>
  );
}

export default TaskItem;
