import { useState, useEffect } from "react";
import getEnv from "./env";

import { getMyProfile } from "./apiOptions";

export const useProfileInfo = (token) => {
  const [profileName, setProfileName] = useState("empty");
  useEffect(() => {
    const getName = async () => {
      if (token) {
        try {
          const info = await getMyProfile(token);
          setProfileName(info);
        } catch (error) {
          console.error("Error");
        }
      }
    };
    getName();
  }, [token]);
  return profileName;
};

export default useProfileInfo;
