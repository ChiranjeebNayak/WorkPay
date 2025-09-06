import { StyleSheet, Text, View } from "react-native";


const months = [
  { number: 1, name: "January" },
  { number: 2, name: "February" },
  { number: 3, name: "March" },
  { number: 4, name: "April" },
  { number: 5, name: "May" },
  { number: 6, name: "June" },
  { number: 7, name: "July" },
  { number: 8, name: "August" },
  { number: 9, name: "September" },
  { number: 10, name: "October" },
  { number: 11, name: "November" },
  { number: 12, name: "December" },
];

function formatDay(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()].name;
  return `${day} ${month}`;
}

function formatTime(dateString) {
  if (!dateString) return "—";

  // Remove Z so JS doesn’t convert
  const localString = dateString.replace("Z", "");
  const date = new Date(localString);

  const hours = date.getHours();
  const minutes = date.getMinutes();

  let h = hours % 12 || 12;
  let m = minutes.toString().padStart(2, "0");
  const ampm = hours < 12 ? "AM" : "PM";

  return `${h}:${m} ${ampm}`;
}

function calculateTotalHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) return "0h";
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffMs = end - start;
  if (diffMs <= 0) return "0h";
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

function convertOvertime(minutes) {
  if (!minutes || minutes === 0) return "0h";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
}

function DataCard({ data }) {

  return (
    <View style={styles.card}>
      {/* first row */}
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.title}>Day</Text>
          <Text style={styles.content}>{formatDay(data.date)}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.title}>Check In</Text>
          <Text style={styles.content}>{formatTime(data.checkInTime)}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.title}>Check Out</Text>
          <Text style={styles.content}>{formatTime(data.checkOutTime)}</Text>
        </View>
      </View>

      {/* second row */}
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.title}>Status</Text>
          <Text
            style={[
              styles.content,
              { color: data.status === "ABSENT" ? "#ff6b6b" : data.status === "PRESENT" ? "#4caf50" : "#ff9800", fontWeight: "bold", fontSize: 16 },
            ]}
          >
            {data.status}
          </Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.title}>Total Hours</Text>
          <Text style={styles.content}>{calculateTotalHours(data.checkInTime, data.checkOutTime)}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.title}>OverTime</Text>
          <Text style={styles.content}>{convertOvertime(data.overtime)}</Text>
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
