import Toast from "react-native-toast-message";


export const showSuccessToast = (message: string) => {
  Toast.show({
    type: "success",
    text1: message,
    position: "top",
    visibilityTime: 4000,
    topOffset: 65,
  });
};

export const showErrorToast = (message: string) => {
  Toast.show({
    type: "error",
    text1: message,
    position: "top",
    visibilityTime: 4000,
    topOffset: 65,
    text1Style: { fontSize: 14, textAlign: "center" },
  });
};
