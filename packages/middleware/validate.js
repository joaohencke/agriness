import * as yup from 'yup';
import boom from 'boom';
import handler from './error';

export const formatMessage = error => {
  let errMessage = `${error.message}`;
  if (error.reason) errMessage += ` - ${error.reason}`;
  if (errMessage.length > 250) {
    errMessage = `${errMessage.slice(0, 150)} ... ${errMessage.slice(errMessage.length - 100, errMessage.length)}`;
  }
  return errMessage;
};

const validate = ({ path = 'params', schema }) => async (req, res, next) => {
  try {
    const yupSchema = yup.object(schema);

    await yupSchema.validate(req[path]);
    req.validData = {
      ...req.validData,
      ...(await yupSchema.cast(req[path])),
    };
    return next();
  } catch (e) {
    return handler(res, boom.badRequest(formatMessage(e)));
  }
};

export default validate;
