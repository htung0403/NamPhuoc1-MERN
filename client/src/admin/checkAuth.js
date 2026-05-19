import { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const useCheckAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get("access_token");

    if (!accessToken) {
      navigate("/admin/dang-nhap");
    }
  }, [navigate]);
};

export default useCheckAuth;
