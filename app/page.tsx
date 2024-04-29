import { fetchPortfolioData } from "@utils/fetchPortfolioData";
import DashboardPage from "@/components/Dashboard/DashboardPage";
import PortfolioSwitchPage from "@/components/Dashboard/PortfolioSwitchPage";

const page = async () => {
  //   const data = await fetchPortfolioData();
  return (
    <div>
      {/* <PortfolioSwitchPage data={data} /> */}
      <DashboardPage />
    </div>
  );
};

export default page;
