import { Image } from "expo-image";
import { StyleSheet } from "react-native";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const Avatar = () => {
  return (
    <Image
      style={styles.image}
      source="https://farm1.static.flickr.com/256/31719945500_f4c3cac93c_b.jpg"
      placeholder={blurhash}
      contentFit="cover"
      transition={1000}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 128,
    height: 128,
    borderRadius: 128,
  },
});

export default Avatar;
