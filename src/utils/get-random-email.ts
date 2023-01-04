import axios from "axios";
import { requestUrl } from "../common/request-url";

export const getRandomEmail = async () => {
  const { data } = await axios.get(
    requestUrl + "/api/v1/?action=genRandomMailbox&count=1"
  );
  const [email] = data;
  return email;
};
