import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect, useState } from "react";
import { getAgentStatistique } from "../../api/auth";

interface StatAttribute {
  graphique2: {
    imprimée: Array<number>;
    nonImprimée: Array<number>;
  };
} 

const initialState: StatAttribute = {
  graphique2: {
    imprimée: [],
    nonImprimée: [],
  },
};

export default function DepartementChartAgent() {

  const auth = useSelector((state: RootState) => state.authReducer);
  const [data, setData] = useState<StatAttribute>(initialState);

  const fetchStatistique = async (token: string) => {
      try {
        const result = await getAgentStatistique(token)
        console.log(result)
        console.log("Contenue de data", data)
        setData({
          graphique2: {
            imprimée: result.graphique2.imprimes,
            nonImprimée: result.graphique2.nonImprimes,
          }
        })
      } catch(error) {
        console.log(error)
      }
    };

  useEffect (() => {
      fetchStatistique(auth.token)
    }, [auth.token]);


  const options: ApexOptions = {
    legend: {
      show: false, // Hide legend
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#7EA045", "#7EA045"], // Define line colors
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line", // Set the chart type to 'line'
      toolbar: {
        show: false, // Hide chart toolbar
      },
    },
    stroke: {
      curve: "straight", // Define the line style (straight, smooth, or step)
      width: [2, 2], // Line width for each dataset
    },

    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0, // Size of the marker points
      strokeColors: "#fff", // Marker border color
      strokeWidth: 2,
      hover: {
        size: 6, // Marker size on hover
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Hide grid lines on x-axis
        },
      },
      yaxis: {
        lines: {
          show: true, // Show grid lines on y-axis
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    tooltip: {
      enabled: true, // Enable tooltip
      x: {
        format: "dd MMM yyyy", // Format for x-axis tooltip
      },
    },
    xaxis: {
      type: "category", // Category-based x-axis
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false, // Hide x-axis border
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
      tooltip: {
        enabled: false, // Disable tooltip for x-axis points
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px", // Adjust font size for y-axis labels
          colors: ["#6B7280"], // Color of the labels
        },
      },
      title: {
        text: "", // Remove y-axis title
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: "Imprimée",
      data: data.graphique2.imprimée ?? [],
    },
    {
      name: "Nom imprimée",
      data: data.graphique2.nonImprimée ?? [],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistique
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Demande imprimée / non imprimée
          </p>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
