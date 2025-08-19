// import React from 'react'
// import {
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
// } from "recharts";
// const CustomPieChart = ({data , color}) => {
//   return (
//      <ResponsiveContainer width="100%" height={325}>
//       <PieChart>
//         <Pie
//           data={data}
//           dataKey="count"
//           nameKey="status"
//           cx="50%"
//           cy="50%"
//           outerRadius={130}
//           innerRadius={100}
//           labelLine={false}
//         >
//           {data.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={color[index % color.length]} />
//           ))}
//         </Pie>
//         <Tooltip />
//         <Legend />
//       </PieChart>
//     </ResponsiveContainer>
//   )
// }

// export default CustomPieChart


import React from 'react';
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CustomPieChart = ({ data = [], color = [] }) => {
  return (
    <ResponsiveContainer width="100%" height={325} >
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={100}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={color[index % color.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip/>} />
        <Legend content={<CustomLegend />}/>
     
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
