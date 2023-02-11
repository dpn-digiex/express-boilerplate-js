import { Response, getIP } from '../utils/index.js';
import { IPAccessList } from "../config/index.js";

export const checkIPAccess = async (req, res, next) => {
  if((IPAccessList.length > 0)) {
    const ip = getIP(req);
    for (var i = 0; i < IPAccessList.length; i++) {
      const item = IPAccessList[i];
      const tn = item?.constructor?.name || "";
      if(tn === "String") {
        if(item != ip) {
          return Response(res, 500);
        }
      } else if(tn === "RegEx") {
        if(!ip.match(item)) {
          return Response(res, 500);
        }
      }
    }
  }

  next();
}
