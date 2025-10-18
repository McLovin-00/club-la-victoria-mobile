import { Image, StyleSheet } from "react-native";

interface ClubLogoProps {
  width?: number;
  height?: number;
}

export const ClubLogo: React.FC<ClubLogoProps> = ({
  width = 160,
  height = 192,
}) => {
  return (
    <Image
      source={require("../assets/images/logo.png")}
      style={[styles.logo, { width, height }]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    alignSelf: "center",
  },
});
