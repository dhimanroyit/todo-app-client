import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import httpReqWithToken from "../helpers/httpReqWithToken";
import SideBar from "../components/SideBar/SideBar";
import TaskItem from "../components/Task/TaskItem";

function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const {
    register,
    reset,
    formState: { errors },
    setFocus,
    handleSubmit,
  } = useForm();

  const toggleUpdate = () => {
    setIsUpdate((prevUpdate) => !prevUpdate);
  };

  const onSubmit = async (data) => {
    const task = { title: data.title };
    try {
      const taskRes = await httpReqWithToken.post("/tasks", task);
      const { statusCode, success, message } = taskRes.data;
      if (statusCode === 201 && success === true) {
        toast(message);
        reset();
        toggleUpdate();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTaskHandler = async (id) => {
    try {
      const taskRes = await httpReqWithToken.delete(`/tasks/${id}`);
      const { statusCode, success, message } = taskRes.data;
      if (statusCode === 200 && success === true) {
        toast(message);
        toggleUpdate();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getTaskHandler = useCallback(async () => {
    try {
      const {
        data: { data },
      } = await httpReqWithToken.get("/tasks");
      setTasks(data);
    } catch (err) {
      console.log(err);
    }
  }, [isUpdate]);

  useEffect(() => {
    getTaskHandler();
  }, [getTaskHandler]);

  useEffect(() => {
    setFocus("title");
  }, []);

  return (
    <div className="flex">
      <SideBar />
      <div className="h-screen flex-1  bg-sky-50">
        <div className="overflow-y-scroll h-full p-7">
          <h1 className="text-2xl font-semibold ">Home Page</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white flex py-2.5 px-5 my-4 rounded-md shadow-sm"
          >
            <input
              {...register("title", {
                required: {
                  value: true,
                  message: "task must be required",
                },
                maxLength: {
                  value: 70,
                  message: "you can use max 70 charecter",
                },
                minLength: {
                  value: 5,
                  message: "you can use min 5 charecter",
                },
              })}
              type="text"
              className="w-full focus:outline-none"
              placeholder="Write Your Task"
            />
            <button type="submit" className="w-7 ml-3">
              <FontAwesomeIcon icon={faPlus} size="lg" />
            </button>
          </form>
          {errors.title && (
            <small className="text-red-400 capitalize">
              {errors.title.message}
            </small>
          )}
          <div className="mt-10">
            <h3>Task List</h3>

            {tasks.length > 0 ? (
              tasks.map((item) => (
                <TaskItem
                  key={item._id}
                  id={item._id}
                  title={item.title}
                  deleteHandler={() => deleteTaskHandler(item._id)}
                  toggleUpdate={toggleUpdate}
                />
              ))
            ) : (
              <h2 className="mt-7">Task list Empty</h2>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskPage;
