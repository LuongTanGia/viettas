/* eslint-disable react/prop-types */
const NCKXem = ({ close, data }) => {
  return (
    <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 zIndex">
      <div
        onClick={close}
        className="overlay bg-gray-800 bg-opacity-80 w-screen h-screen fixed top-0 left-0 right-0 bottom-0"
      ></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col min-w-[40rem] min-h-[8rem] bg-white  p-2 rounded-xl shadow-custom overflow-hidden">
        <div className="flex flex-col  min-w-[90rem] ">
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default NCKXem;
