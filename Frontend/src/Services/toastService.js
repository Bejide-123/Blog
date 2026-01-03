import toast from 'react-hot-toast';

export const toastService = {
  success: (message) => {
    toast.success(message);
  },
  error: (message) => {
    toast.error(message);
  },
  loading: (message) => {
    return toast.loading(message);
  },
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
  promise: (promise, { loading, success, error }) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    });
  }
};