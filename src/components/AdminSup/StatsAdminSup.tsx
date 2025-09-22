import { useSelector } from "react-redux";
import {
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import { RootState } from "../../store";
import { getStatistique } from "../../api/auth";
import { useEffect, useState } from "react";

interface StatistiqueAttribute {
  militantFemme: number;
  militantHomme: number;
  militantImpaye: number;
  militantImprime: number;
  militantNonImprime: number;
  militantPaye: number;
};

const initialState: StatistiqueAttribute = {
  militantFemme: 0,
  militantHomme: 0,
  militantImpaye: 0,
  militantImprime: 0,
  militantNonImprime: 0,
  militantPaye: 0,
};

export default function EcommerceMetrics() {

  const auth = useSelector((state: RootState) => state.authReducer);
  const [data, setData] = useState<StatistiqueAttribute>(initialState);

  const fetchStatistique = async (token: string) => {
    try {
      const result = await getStatistique(token)
      // console.log(result)
      setData({
        militantFemme: result.militantFemme ? result.militantFemme.length : 0,
        militantHomme: result.militantHomme ? result.militantHomme.length : 0,
        militantImpaye: result.militantImpaye ? result.militantImpaye.length : 0,
        militantImprime: result.militantImprime ? result.militantImprime.length : 0,
        militantNonImprime: result.militantNonImprime ? result.militantNonImprime.length : 0,
        militantPaye: result.militantPaye ? result.militantPaye.length : 0,
      })
      // console.log("Contenue de data", data)
    } catch(error) {
      console.log(error)
    }
  };

  useEffect (() => {
    fetchStatistique(auth.token)
  }, [auth.token]);

  useEffect (() => {
    console.log(data)
  }, [data]);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 w-full">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Femmes Militante
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data.militantFemme ? data.militantFemme : 0}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 w-full">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Hommes Militante
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data.militantHomme ? data.militantHomme : 0}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 w-full">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total impayée
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data.militantImpaye ? data.militantImpaye : 0}
            </h4>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 w-full">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total payée
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data.militantPaye ? data.militantPaye : 0}
            </h4>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 w-full">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total imprimée
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data.militantImprime ? data.militantImprime : 0}
            </h4>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 w-full">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Non imprimée
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
               {data.militantNonImprime ? data.militantNonImprime : 0}
            </h4>
          </div>
        </div>
      </div>

    </div>
  );
}

