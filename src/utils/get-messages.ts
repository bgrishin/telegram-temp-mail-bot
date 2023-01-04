import axios from "axios";
import { requestUrl } from "../common/request-url";

const readMessage = async (login, domain, id) => {
  const { data } = await axios.get(
    requestUrl +
      `/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${id}`
  );
  return data;
};

export const getMessages = async (email) => {
  const [login, domain] = email.split("@");
  const { data } = await axios.get(
    requestUrl + `/api/v1/?action=getMessages&login=${login}&domain=${domain}`
  );
  return await Promise.all(
    data.map(async (msg) => await readMessage(login, domain, msg.id))
  );
};
