import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../cmponents/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import axiosinstance from "../../utils/axiosinstance";
import moment from "moment";
import { LuArrowRight } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";
import { addThousandsSeparator } from "../../utils/helper";
import InfoCard from "../../cmponents/layouts/Cards/Infocard";
import TaskListTable from "../../cmponents/layouts/TaskListTable";
import CustomPieChart from "../../cmponents/layouts/paichart/CustomPieChart";
import CustomBarChart from "../../cmponents/layouts/paichart/CustomBarChart";
const Dashboard = () => {
  useUserAuth();
  const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const prepareChartData = (data) => {
    const taskDistribution = data?.charts?.taskDistribution || {};
    const taskPriorityLevels = data?.charts?.taskPriorityLevels || {};

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.pending || 0 },
      { status: "in-progress", count: taskDistribution?.["in-progress"] || 0 },
      { status: "Completed", count: taskDistribution?.completed || 0 },
    ];
    setPieChartData(taskDistributionData);

    const PriorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.medium || 0 },
      { priority: "High", count: taskPriorityLevels?.high || 0 },
    ];
    setBarChartData(PriorityLevelData);
  };

  const getDashboardData = async () => {
    try {
      const response = await axiosinstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data);
        console.log("Pie Chart Data:", pieChartData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);
  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div className="col-span-3">
          <h2 className="text-xl md:text-2xl">Hello! {user?.name}</h2>
          <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
            {moment().format("dddd Do MMM YYYY")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <InfoCard
            label="Total Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.All || 0
            )}
            color="bg-primary"
          />
          <InfoCard
            label="Pending Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.pending || 0
            )}
            color="bg-violet-500"
          />
          <InfoCard
            label="InProgress Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.["in-progress"] || 0
            )}
            color="bg-cyan-500"
          />
          <InfoCard
            label="Completed"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.completed || 0
            )}
            color="bg-lime-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div>
          <div className="card">
            <div className="flex items-center justify-between ">
              <h5 className="font-medium">Task Distribution</h5>
            </div>
            <CustomPieChart data={pieChartData} color={COLORS} />
          </div>
        </div>
        <div>
          <div className="card">
            <div className="flex items-center justify-between ">
              <h5 className="font-medium">Task Priority Levels</h5>
            </div>
            <CustomBarChart data={barChartData} />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between ">
              <h5 className="text-lg">Recent Tasks</h5>
              <button className="card-btn" onClick={onSeeMore}>
                See All <LuArrowRight className="text-base inline-block ml-1" />
              </button>
            </div>
            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
