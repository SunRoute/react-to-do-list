import React from "react";
import AddTaskComponent from "../components/AddTaskComponent";
import MyTaskComponent from "../components/MyTaskComponent";
import NavbarComponent from "../components/NavbarComponent";

const HomePage = () => {
  return (
    <div className="h-full bg-gray-400">
      {/* navbar */}
      <NavbarComponent />
      {/* task container */}
      <div className="flex w-full h-full gap-8 py-6 px-6">
        {/* add task component */}
        <AddTaskComponent />
        {/* my task component */}
        <div
          className="flex flex-col gap-3 flex-3/4 bg-blue-200 rounded-md
p-4"
        >
          <h1 className="text-blue-900 font-semibold text-lg">My Tasks</h1>
          <MyTaskComponent />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
