import { StyleSheet, Text, View } from "react-native";

function DataCard({ data }) {
  return (
    <View style={styles.card}>
      {/* first row */}
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.title}>Day</Text>
          <Text style={styles.content}>{data.day}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.title}>Check In</Text>
          <Text style={styles.content}>{data.checkIn}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.title}>Check Out</Text>
          <Text style={styles.content}>{data.checkOut}</Text>
        </View>
      </View>

      {/* second row */}
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.title}>Status</Text>
          <Text
            style={[
              styles.content,
              { color: data.status === "Absent" ? "#ff6b6b" : "#4caf50", fontWeight: "bold", fontSize: 16 },
            ]}
          >
            {data.status}
          </Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.title}>Total Hours</Text>
          <Text style={styles.content}>{data.totalHours}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.title}>OverTime</Text>
          <Text style={styles.content}>{data.overtime}</Text>
        </View>
      </View>
    </View>
  );
}

export default DataCard;

const styles = StyleSheet.create({
  card: {
    width: "90%",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
    padding: 10,
    gap: 20,
    backgroundColor: "#1c2a38",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  col: {
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    color: "#fff",
  },
});
