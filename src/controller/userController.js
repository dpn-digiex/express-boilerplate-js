import bcrypt from 'bcrypt';
import { Response, getRegExSearch, mongooseTypeData } from '../utils/index.js';
import { UserModel } from '../model/user.js';
import { SALT_NUM } from '../config/index.js';

// *  [POST] /api/user/list { search }
export const searchUserList = async (req, res, next) => {
  try {
    const body = req?.body || {};
    const name = body?.name || body?.search || "";
    const fieldsSearch = ['name', 'email'];
    const filter = {};
    filter["$or"] = [...fieldsSearch.map(field => ({
      [field]: getRegExSearch(name || "")
    }))]
    // limit filter
    const totalItem = await UserModel.countDocuments(filter);
    const pageLength = Math.max(body?.pageLength || body?.page?.pageLength || filter?.pageLength || filter?.page?.pageLength || 50, 1);
    const pageIndex = Math.max(body?.pageIndex || body?.page?.pageIndex || filter?.pageIndex || filter?.page?.pageIndex || 0, 0);
    const sort = body?.sort || filter?.sort || "-createdAt";
    const pageCount = Math.floor(totalItem * 1.0 / pageLength);
    const listSearch = await UserModel.find(filter)
        .sort(sort)
        .skip(pageIndex * pageLength)
        .limit(pageLength)
    const listResponse = listSearch.map(item => ({
      _id: item._id,
      name: item.name,
      email: item.email,
      status: item.status,
    }));
    return Response(res, 200, { list: listResponse, page: { totalItem, pageLength, pageIndex, pageCount } }, req, next);
  } catch (error) {
    console.log("Error: ", error);
  }
  Response(res, 500);
}

// *  [POST] /api/user/add { name, email, password }
export const addUser = async (req, res, next) => {
  try {
    const request = req.body;
    const checkUserExist = await UserModel.findOne({ email: request?.email });
    if (checkUserExist) {
      return Response(res, 500, 'User is exist');
    }
    else {
      const salt = await bcrypt.genSalt(SALT_NUM);
      const hashedPass = await bcrypt.hash(request.password, salt);
      const newUser = new UserModel({ ...request, password: hashedPass });
      const response = await newUser.save();
      const { password, updatedAt, createdAt, __v, ...newData } = mongooseTypeData.mongooseToObject(response);
      return Response(res, 200, newData, req, next);
    }
  } catch (error) {
    console.log("Error: ", error);
  }
  Response(res, 500);
}

// *  [POST] /api/user/:id/detail
export const getUserDetail = async (req, res, next) => {
  try {
    const id = req.params?.id;
    const detailUser = await UserModel.findById(id);
    const { password, updatedAt, createdAt, __v, ...detailData } = mongooseTypeData.mongooseToObject(detailUser);
    return Response(res, 200, detailData, req, next);
  } catch (error) {
    console.log("Error: ", error);
  }
  Response(res, 500);
}

// *  [PATCH] /api/user/:id/update { name, email, password }
export const updateUser = async (req, res, next) => {
  try {
    const id = req?.params?.id;
    const checkBadUpdate = await UserModel.find({ _id: { $ne: id }, email: req.body?.email });
    if (checkBadUpdate.length !== 0) {
      return Response(res, 500, "Email is being existed!");
    } else {
      if (req.body?.password) {
        const salt = await bcrypt.genSalt(SALT_NUM);
        const hashedPass = await bcrypt.hash(req.body?.password, salt);
        await UserModel.findOneAndUpdate({ _id: id }, { ...req.body, password: hashedPass }, { upsert: false });
      }
      else {
        await UserModel.findOneAndUpdate({ _id: id }, req.body, { upsert: false });
      }
      return Response(res, 200, {}, req, next);
    }
  } catch (error) {
    console.log("Error: ", error);
  }
  Response(res, 500);
}

// *  [POST] /api/user/:id/lock { lock | unlock}
export const activatedUser = async (req, res, next) => {
  try {
    let response;
    const id = req?.params?.id;
    const { lock } = req.body;
    if (lock === true) {
      response = await UserModel.updateOne({ _id: id }, { status: "Deactive" });
    }
    else {
      response = await UserModel.updateOne({ _id: id }, { status: "Active" });
    }
    return Response(res, 200, response, req, next);
  } catch (error) {
    console.log("Error: ", error);
  }
  Response(res, 500);
}

// *  [DELETE] /api/user/:id/remove
export const removeUser = async (req, res, next) => {
  try {
    const id = req.params?.id;
    const deteledUser = await UserModel.deleteOne({ _id: id });
    return Response(res, 200, deteledUser, req, next);
  } catch (error) {
    console.log("Error: ", error);
  }
  Response(res, 500);
}

// * [POST] /api/user/get-all
export const getAllUser = async (req, res, next) => {
  try {
    const listUser = await UserModel.find({}).select("_id, name");
    if (listUser) {
      return Response(res, 200, listUser, req, next);
    }
    else return Response(res, 500);
  } catch (error) {
    console.log("Error: ", error);
  }
  Response(res, 500);
}
