// import axiosinstance from "./axiosinstance";
// import { API_PATHS } from "./apiPaths";

// // Function to upload image file
// const uploadImage = async (imageFile) => {
//   const formData = new FormData();
//   formData.append("image", imageFile);

//   try {
//     const response = await axiosinstance.post(API_PATHS.AUTH.UPLOAD_IMG, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Image upload failed", error);
//     throw new Error("Image upload failed");
//   }
// };

// export default uploadImage;

import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";
const uploadImage = async (imageFile) => {
  const formData = new FormData();
  // Append image file to form data
  formData.append("image", imageFile);
  try {
    const response = await axiosInstance.post(
      API_PATHS.AUTH.UPLOAD_IMG,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error("Error uploading the image: ", error);
    throw error; // Rethrow error for handling
  }
};
export default uploadImage;
