import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
// import Videos from "./pages/UiElements/Videos";
// import Images from "./pages/UiElements/Images";
// import Alerts from "./pages/UiElements/Alerts";
// import Badges from "./pages/UiElements/Badges";
// import Avatars from "./pages/UiElements/Avatars";
// import Buttons from "./pages/UiElements/Buttons";
// import LineChart from "./pages/Charts/LineChart";
// import BarChart from "./pages/Charts/BarChart";
// import Calendar from "./pages/Calendar";
// import BasicTables from "./pages/Tables/BasicTables";
// import FormElements from "./pages/Forms/FormElements";
// import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
// import Home from "./pages/Dashboard/Home";
import HomeAgent from "./pages/Agent/HomeAgent";
import DemandeList from "./pages/Agent/DemandeList";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, RootState } from "./store";
// import CustomToast from "./components/new/CustomToaster";
import ProtectedRoute from "./components/new/ProtectedRoute";
import HomeAdminSup from "./pages/AdminSup/HomeAdminSup";
import PrixComponent from "./pages/AdminSup/PrixComponent";
import { setCirconscriptions, setCommunes, setDepartements } from "./store/slices/appSlice";
import { useEffect } from "react";
import { getCirconscriptions, getCommunes, getDepartements } from "./api/app";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import HomeAdmin from "./pages/Admin/HomeAdmin";
import UserList from "./pages/Admin/UserList";
import ListRefused from "./pages/Global/ListRefused";
import ListCorrected from "./pages/Global/ListCorrected";
import ListPayed from "./pages/Global/ListPayed";
import ListPrint from "./pages/Global/ListPrint";
import ListNoPrint from "./pages/Global/ListNotPrint";
import ListNotPayed from "./pages/Global/ListNotPayed";

export default function App() {

  const dispatch = useDispatch();

  const fetchCommunes = async () => {
    const communes = await getCommunes();
    dispatch(setCommunes(communes.data));
  };
  const fetchDepartements = async () => {
    const departements = await getDepartements();
    dispatch(setDepartements(departements.data));
  };
  const fetchCirconscriptions = async () => {
    const circonscriptions = await getCirconscriptions();
    console.log(circonscriptions);
    dispatch(setCirconscriptions(circonscriptions.data));
  };

  useEffect(() => {
    fetchCommunes();
    fetchDepartements();
    fetchCirconscriptions();
  }, []);

  const auth = useSelector((state: RootState) => state.authReducer);

  return (
    <>
      <PersistGate loading={null} persistor={persistor}>
        {/* <CustomToast /> */}
        <Toaster/>
        <Router>
          <ScrollToTop />
          <Routes>

            {/* Auth Pages */}
            <Route path="/connexion" element={<SignIn />} />
            <Route path="/inscription" element={<SignUp />} />

            {/* Dashboard Layout */}
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route index path="/" element={ auth.user?.role === "agent" ? <HomeAgent /> : auth.user?.role === "admin" ? <HomeAdmin /> : <HomeAdminSup /> } />

                <Route path="/agent" >
                  <Route index element={<HomeAgent />} />
                  <Route path="demandes/list" element={<DemandeList />} />
                </Route>

                <Route path="/admin-sup" >
                  <Route index element={<HomeAdminSup />} />
                  <Route path="prix" element={<PrixComponent />} />
                </Route>

                <Route path="/admin" >
                  <Route index element={<HomeAdmin />} />
                  <Route path="utilisateurs" element={<UserList />} />
                  <Route path="demande/list" element={<UserList />} />
                  <Route path="demande/payer" element={<ListPayed />} />
                  <Route path="demande/impayer" element={<ListNotPayed />} />
                  <Route path="demande/corriger" element={<ListCorrected />} />
                  <Route path="demande/refuser" element={<ListRefused />} />
                  <Route path="demande/imprimer" element={<ListPrint />} />
                  <Route path="demande/non-imprimer" element={<ListNoPrint />} />

                </Route>

                {/* Others Page */}
                <Route path="/profile" element={<UserProfiles />} />
                {/* <Route path="/calendar" element={<Calendar />} />
                <Route path="/blank" element={<Blank />} /> */}

                {/* Forms */}
                {/* <Route path="/form-elements" element={<FormElements />} /> */}

                {/* Tables */}
                {/* <Route path="/basic-tables" element={<BasicTables />} /> */}

                {/* Ui Elements */}
                {/* <Route path="/alerts" element={<Alerts />} />
                <Route path="/avatars" element={<Avatars />} />
                <Route path="/badge" element={<Badges />} />
                <Route path="/buttons" element={<Buttons />} />
                <Route path="/images" element={<Images />} />
                <Route path="/videos" element={<Videos />} /> */}

                {/* Charts */}
                {/* <Route path="/line-chart" element={<LineChart />} />
                <Route path="/bar-chart" element={<BarChart />} /> */}
              </Route>

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </PersistGate>
    </>
  );
}
