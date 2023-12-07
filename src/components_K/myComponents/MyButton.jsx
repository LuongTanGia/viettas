// import React, { useEffect, useState } from "react";

// const MyButton = ({ givenName }) => {
//   const [bgColor, setBgColor] = useState("#f1f0f0");
//   useEffect(() => {
//     // Hàm tạo màu ngẫu nhiên
//     const generateRandomColor = () => {
//       const letters = "0123456789ABCDEF";
//       let color = "#";
//       for (let i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)];
//       }
//       return color;
//     };

//     // Thiết lập màu nền mới khi component được mount
//     setBgColor(generateRandomColor());
//   }, []);
//   return (
//     <button
//       className={`w-[40px] h-[40px] rounded-full p-1 hover:bg-[${bgColor}]`}
//     >
//       {givenName.charAt(0)}
//     </button>
//   );
// };

// export default MyButton;
