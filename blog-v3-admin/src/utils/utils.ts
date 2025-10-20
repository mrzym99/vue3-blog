export function deepClone(obj: any) {
  const objClone = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === "object") {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        //判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === "object") {
          objClone[key] = deepClone(obj[key]);
        } else {
          //如果不是，简单复制
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
}

/**
 * 图片压缩
 * @param {*} file 图片
 */
export const imageConversion = file => {
  return new Promise((resolve: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e: any) => {
      const image = new Image();
      image.src = e.target.result;
      image.onload = () => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          canvas.getContext("2d").drawImage(image, 0, 0);
          canvas.toBlob(blob => {
            resolve(blob);
          }, "image/webp");
        };
      };
    };
  });
};
