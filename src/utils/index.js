import osSys from "os";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import moment from 'moment';
import { templateEmail } from '../../views/templateEmail.js';
import {
  REFRESH_KEY,
  SECRECT_KEY,
  Mail_Transport,
  Mail_Sender,
  AccessToken_Expired,
  RefreshToken_Expired
} from '../config/index.js';
import path from "path";

const _aregex = /[~!@#$%^&*()\-_+={}[\]\|\\:;"'`<,>\.?\/]/gmi;

export const Response = async (res, code, data, req, next) => {
	const status = (code === true) ? 200 : (code || 500);
	const success = ((status >= 200) && (status <= 299));

	res.status(code||500).json({
		status,
		success,
		data: (data === undefined) ? success : data,
	});
}

export const getRegExSearch = function(str, flag) {
	let ls = false;
  const reg = new RegExp(str.split("").map(k => {
    if(k.match(/[\s\t\n\r]/gm)) {
      if(ls === true) return "";
      ls = true;
      return '[\\s\\t\\n\\r\\.\\,\\-\\_]{1,}';
    }
    ls = false;
	if(k.match(_aregex)) {
		k = `\\${k}`;
  } else {
    k = {
      'a': 'aàảãáạăằẳẵắặâầẩẫấậ',
      'd': 'dđ',
      'e': 'eèẻẽéẹêềểễếệ',
      'o': 'oòỏõóọôồổỗốộơờởỡớợõ',
      'i': 'iìỉĩíị',
      'u': 'uùủũúụưừửữứự',
      'y': 'yỳỷỹýỵ',
    }[k] || k;
	}
    return `[${k}]`;
  }).join(""), flag || 'gmi');
  return reg;
};

export const generateAccessToken = data => {
  return jwt.sign({
    id: data?._id || "",
    name: data?.name || "",
    email: data?.email || ""
  },
    SECRECT_KEY,
    { expiresIn: AccessToken_Expired || '4h' }
  );
};

export const generateRefreshToken = data => {
  return jwt.sign(
    { id: data },
    REFRESH_KEY,
    { expiresIn: RefreshToken_Expired || '30d' }
  );
};

export const mongooseTypeData = {
    multipleMongooseToObject: (mongooses) => mongooses.map(mongoose => mongoose.toObject()),
    mongooseToObject: (mongoose) => mongoose ? mongoose.toObject() : mongoose
};

export const sendMailConfirmReset = async (res, data, codeConfirm) => {
  const { email, name } = data;
  try {
    const transporter = nodemailer.createTransport(Mail_Transport);
    await transporter.sendMail({
      from: Mail_Sender || Mail_Transport?.auth?.user,
      to: email,
      subject: "Reset password",
      html: templateEmail({name: name, codeConfirm: codeConfirm})
    });
    return Response(res, 200, { message: 'Send the email to confirm reset password success', verify: email || "" });
	} catch (error) {
		console.log('Error', error);
	}

	return Response(res, 500);
};

export const formatDate = (date, format = 'DD/MM/YYYY hh:mm:ss a') => {
  if (!date) return "";
  let newDate = date;
  if (typeof date === 'string') {
    newDate = new Date(date);
    if (newDate.toString() === 'Invalid Date') {
      newDate = new Date(moment(date, format).toDate());
    }
  }
  return moment(newDate).format(format);
};

export const randomString = (length, type = 'NUM') => {
  let result = "";
  let characters = {
    'NUM'       : '0123456789',
    'CHARACTERS': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    'ALL'       : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  }[type]
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const isAxiosMethod = (method) => {
  const listMethod = ['get', 'post', 'put', 'patch', 'delete'];
  return listMethod.includes(method.toLowerCase());
}

export const insertStringAtIndex = (src, idx, string) => {
  if (idx > 0) {
    return src.substring(0, idx) + string + src.substring(idx);
  }
  return string + src;
}

export const S4 = ()=> {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

export const absLocalFile = (input) => {
  if (input[0] === '/' || input.match(/^[a-zA-Z][\:]/)) {
    return 'file://' + input;
  }
  return 'file://' + path.normalize(path.join(process.cwd(), input))
}

export const getUserIP = function (req) {
  var ip = (((req.headers["x-forwarded-for"] || req.headers["x-forwarded-for-client-ip"]) ||
    (req.headers["x-forwarded-for-ip"] || req.connection.remoteAddress)) ||
    ((req.headers["x-forward-for"] || req.headers["x-forward-for-client-ip"]) ||
    (req.headers["x-forward-for-ip"] || req.connection.remoteAddress))) ||
    ((req.socket.remoteAddress || req.client._peername.address) ||
    (req.info ? req.info.remoteAddress : (req.connection.socket ? req.connection.socket.remoteAddress : false)));
	return ip;
}

export const getServerIP = function() {
  var neti = osSys.networkInterfaces();
  neti = neti["ppp0"] || neti["ppp"] ||
    neti["en0"]    || neti["en"]   ||
    neti["ens192"] || neti["ens"]  ||
    neti["ens33"]  ||
    neti["eth0"]   || neti["eth"]  ||
    neti["wlan0"]  || neti["wlan"] ||
    neti["awdl0"]  || neti["awdl"] ||
    neti["llw0"]   || neti["llw"]  ||
    neti["lo0"]    || neti["lo"]   ||
    neti["Wi-Fi"]  || neti["wi-fi"]|| [];
    //neti["utun0"] || neti["utun1"] ||
    
  var address = neti[0].address || "";
  for(var i = 0; i < neti.length; i++) {
    var n = neti[i];
    if(n.family == "IPv4") {
      if(n.address) {
        address = n.address;
        break;
      }
    }
  }

  return (address || "127.0.0.1");
}

export const getIP = (req) => {
	const ip = getUserIP(req) || getServerIP();
	return ip;
}