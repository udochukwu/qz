import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';

export interface ErrorMessage {
  error: string;
}

export const sendErrorMessage = (e: unknown) => {
  const error = 'Server error occured. Try again later.';
  if (isAxiosError<ErrorMessage>(e)) {
    console.log(e.response?.data.error);
    toast.error(e.response?.data.error ?? error);
  } else if (typeof e === 'string') {
    toast.error(e);
  } else {
    toast.error(error);
  }
};
