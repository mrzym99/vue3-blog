const path = require("path");

const {
  result,
  ERRORCODE,
  throwError,
  tipsResult,
} = require("../../result/index");
const errorCodeUpload = ERRORCODE.UPLOAD;
const errorCodeConfig = ERRORCODE.CONFIG;

const {
  updateConfig,
  getConfig,
  addView,
} = require("../../service/config/index");
const fs = require("fs");
const { upToQiniu, deleteImgs } = require("../../utils/qiniuUpload");
const { minioUpload, deleteMinioImgs } = require("../../utils/minioUpload");

const { UPLOADTYPE, DOMAIN, APP_PORT } = require("../../config/config.default");
const { isValidUrl } = require("../../utils/tool");
class UtilsController {
  // 图片上传
  async upload(ctx) {
    try {
      const { file } = ctx.request.files;

      if (!UPLOADTYPE) {
        return ctx.app.emit(
          "error",
          throwError(errorCodeUpload, "请配置文件上传模式")
        );
      }

      if (file) {
        if (UPLOADTYPE === "local") {
          ctx.body = result("图片上传成功", {
            url:
              `http://127.0.0.1:${APP_PORT}/local/` +
              path.basename(file.filepath),
          });
        } else if (UPLOADTYPE === "qiniu") {
          if (!DOMAIN) {
            return ctx.app.emit(
              "error",
              throwError(errorCodeUpload, "请配置七牛云加速域名")
            );
          }
          let completeUrl = isValidUrl(DOMAIN) ? DOMAIN : "http://" + DOMAIN;
          if (completeUrl.charAt(completeUrl.length - 1) != "/") {
            completeUrl = completeUrl + "/";
          }
          // 创建文件可读流
          const reader = fs.createReadStream(file.filepath);
          // 命名文件
          const fileUrl = file.name;
          // 调用方法
          const res = await upToQiniu(reader, fileUrl);
          if (res) {
            ctx.body = result("图片上传成功", {
              url: completeUrl + res.hash,
            });
          }
        } else if (UPLOADTYPE === "minio") {
          const res = await minioUpload(file.filepath);
          if (res) {
            ctx.body = result("图片上传成功", {
              url: res,
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
      return ctx.app.emit("error", throwError(errorCodeUpload, "文件上传失败"));
    }
  }

  // 修改网站设置
  async updateConfig(ctx) {
    try {
      let config = await getConfig();
      // 如果背景图不一致，删除原来的
      const {
        avatar_bg,
        blog_avatar,
        qq_link,
        we_chat_link,
        we_chat_group,
        qq_group,
        we_chat_pay,
        ali_pay,
      } = ctx.request.body;

      if (UPLOADTYPE == "qiniu") {
        if (avatar_bg && config.avatar_bg && avatar_bg != config.avatar_bg) {
          await deleteImgs([config.avatar_bg.split("/").pop()]);
        }
        if (
          blog_avatar &&
          config.blog_avatar &&
          blog_avatar != config.blog_avatar
        ) {
          await deleteImgs([config.blog_avatar.split("/").pop()]);
        }
        if (qq_link && config.qq_link && qq_link != config.qq_link) {
          await deleteImgs([config.qq_link.split("/").pop()]);
        }
        if (
          we_chat_link &&
          config.we_chat_link &&
          we_chat_link != config.we_chat_link
        ) {
          await deleteImgs([config.we_chat_link.split("/").pop()]);
        }
        if (
          we_chat_group &&
          config.we_chat_group &&
          we_chat_group != config.we_chat_group
        ) {
          await deleteImgs([config.we_chat_group.split("/").pop()]);
        }
        if (qq_group && config.qq_group && qq_group != config.qq_group) {
          await deleteImgs([config.qq_group.split("/").pop()]);
        }
        if (
          we_chat_pay &&
          config.we_chat_pay &&
          we_chat_pay != config.we_chat_pay
        ) {
          await deleteImgs([config.we_chat_pay.split("/").pop()]);
        }
        if (ali_pay && config.ali_pay && ali_pay != config.ali_pay) {
          await deleteImgs([config.ali_pay.split("/").pop()]);
        }
      }

      const Utils = new UtilsController();
      if (UPLOADTYPE == "minio") {
        if (avatar_bg && config.avatar_bg && avatar_bg != config.avatar_bg) {
          await deleteMinioImgs([config.avatar_bg.split("/").pop()]);
        }
        if (
          blog_avatar &&
          config.blog_avatar &&
          blog_avatar != config.blog_avatar
        ) {
          await deleteMinioImgs([config.blog_avatar.split("/").pop()]);
        }
        if (qq_link && config.qq_link && qq_link != config.qq_link) {
          await deleteMinioImgs([config.qq_link.split("/").pop()]);
        }
        if (
          we_chat_link &&
          config.we_chat_link &&
          we_chat_link != config.we_chat_link
        ) {
          await deleteMinioImgs([config.we_chat_link.split("/").pop()]);
        }
        if (
          we_chat_group &&
          config.we_chat_group &&
          we_chat_group != config.we_chat_group
        ) {
          await deleteMinioImgs([config.we_chat_group.split("/").pop()]);
        }
        if (qq_group && config.qq_group && qq_group != config.qq_group) {
          await deleteMinioImgs([config.qq_group.split("/").pop()]);
        }
        if (
          we_chat_pay &&
          config.we_chat_pay &&
          we_chat_pay != config.we_chat_pay
        ) {
          await deleteMinioImgs([config.we_chat_pay.split("/").pop()]);
        }
        if (ali_pay && config.ali_pay && ali_pay != config.ali_pay) {
          await deleteMinioImgs([config.ali_pay.split("/").pop()]);
        }
      }

      let res = await updateConfig(ctx.request.body);

      ctx.body = result("修改网站设置成功", res);
    } catch (err) {
      console.error(err);
      return ctx.app.emit(
        "error",
        throwError(errorCodeConfig, "修改网站设置失败")
      );
    }
  }
  // 获取网站设置
  async getConfig(ctx) {
    try {
      let res = await getConfig();
      if (res) {
        ctx.body = result("获取网站设置成功", res);
      } else {
        ctx.body = tipsResult("请去博客后台完善博客信息");
      }
    } catch (err) {
      console.error(err);
      return ctx.app.emit(
        "error",
        throwError(errorCodeConfig, "获取网站设置失败")
      );
    }
  }
  // 增加网站访问次数
  async addView(ctx) {
    try {
      let res = await addView();
      if (res == "添加成功") {
        ctx.body = result("增加访问量成功", res);
      } else if (res == "需要初始化") {
        ctx.body = tipsResult("请先初始化网站信息");
      }
    } catch (err) {
      console.error(err);
      return ctx.app.emit(
        "error",
        throwError(errorCodeConfig, "增加网站访问量失败")
      );
    }
  }
}

module.exports = new UtilsController();
