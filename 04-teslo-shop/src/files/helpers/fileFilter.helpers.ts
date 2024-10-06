export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
  if (!file) return callback(new Error('file is emtpy'), false);

  const fileExtension = file.mimetype.split('/')[1];
  const validExtension = ['jpg', 'png', 'jpeg', 'gif'];
  if (validExtension.includes(fileExtension)) {
    return callback(null, true);
  }

  // console.log(file);
  callback(null, false);
};
