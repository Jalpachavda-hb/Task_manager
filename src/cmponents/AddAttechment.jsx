// import React, { useState } from "react";
// import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
// import { LuPaperclip } from "react-icons/lu";

// const AddAttachment = ({ setAttachments, attechments }) => {
//   const [option, setOption] = useState("");

//   const handleAddOption = () => {
//     if (option.trim()) {
//       setAttachments([...attechments, option.trim()]);
//       setOption("");
//     }
//   };

//   const handleDeleteOption = (index) => {
//     const updatedArr = attechments.filter((_, idx) => idx !== index);
//     setAttachments(updatedArr);
//   };

//   return (
//     <div className="space-y-4">
//       {/* Attachment List */}
//       {attechments.map((item, index) => (
//         <div
//           key={index}
//           className="flex justify-between items-center bg-gray-50 border border-gray-200 px-3 py-2 rounded-md mt-2"
//         >
//           <div className="flex flex-1  items-center gap-3 text-sm text-gray-700">
//             <LuPaperclip className="text-gray-400" />
//             <p className="text-xs text-black">{item}</p>
//           </div>
//           <button
//             className="cursor-pointer"
//             onClick={() => handleDeleteOption(index)}
//           >
//             <HiOutlineTrash className="text-lg  text-red-500" />
//           </button>
//         </div>
//       ))}
 
//       {/* Input Field */}
//       <div className="flex items-center gap-3 cursor-pointer mt-4">
//         <div className=" flex-1 flex item-cneter gap-3 border border-gray-200 rounded-md px-3">
//         <LuPaperclip className="text-gray-400 mt-2" />
//         <input
//           type="text"
//           placeholder="Add file link"
//           value={option}
//           onChange={({ target }) => setOption(target.value)}
//           className=" w-full text-[13px] text-black outline-none bg-white py -2 flex-1 px-3 py-2 rounded text-sm"
//         />
// </div>
//         <button
//           onClick={handleAddOption}
//           className="card-btn text-nowrap"
//         >
//           <HiMiniPlus className=" text-lg " />
//           Add
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AddAttachment;


import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip } from "react-icons/lu";

const AddAttachment = ({ setAttachments, attechments }) => {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if (option.trim()) {
      setAttachments([...attechments, { url: option.trim() }]);
      setOption("");
    }
  };

  const handleDeleteOption = (index) => {
    const updatedArr = attechments.filter((_, idx) => idx !== index);
    setAttachments(updatedArr);
  };

  return (
    <div className="space-y-4">
      {/* Attachment List */}
      {attechments.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-gray-50 border border-gray-200 px-3 py-2 rounded-md mt-2"
        >
          <div className="flex flex-1 items-center gap-3 text-sm text-gray-700">
            <LuPaperclip className="text-gray-400" />
            <p className="text-xs text-black">{item.url}</p>
          </div>
          <button
            className="cursor-pointer"
            onClick={() => handleDeleteOption(index)}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      {/* Input Field */}
      <div className="flex items-center gap-3 cursor-pointer mt-4">
        <div className="flex-1 flex items-center gap-3 border border-gray-200 rounded-md px-3">
          <LuPaperclip className="text-gray-400 mt-2" />
          <input
            type="text"
            placeholder="Add file link"
            value={option}
            onChange={({ target }) => setOption(target.value)}
            className="w-full text-[13px] text-black outline-none bg-white py-2 px-3 rounded text-sm"
          />
        </div>
        <button onClick={handleAddOption} className="card-btn text-nowrap">
          <HiMiniPlus className="text-lg" />
          Add
        </button>
      </div>
    </div>
  );
};

export default AddAttachment;
