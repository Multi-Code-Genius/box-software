import { Mosaic } from "react-loading-indicators";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex flex-col dark:bg-[var(--bgColor)] bg-[var(--bgColor)] justify-center items-center w-screen h-screen p-4 m-0 overflow-hidden transition duration-300 ease-in-out z-[9999]">
      <div className="flex justify-center items-center h-screen">
        <Mosaic color={["#3d4293", "#4e54b5", "#7277c4", "#2e326f"]} />
      </div>
    </div>
  );
};

export default Loading;
