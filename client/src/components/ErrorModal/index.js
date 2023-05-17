import React from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";

const { width, height } = Dimensions.get("window");

const ErrorModal = ({ selectedError, modalVisible, setModalVisible }) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
      setModalVisible(!modalVisible);
    }}
  >
    <View style={modalStyle.overlay}>
      <View style={modalStyle.centeredView}>
        <View style={modalStyle.modalView}>
          <Text style={modalStyle.modalTitle}>Error details</Text>
          <ScrollView style={modalStyle.scrollView}>
            {selectedError.map((error) => (
              <View key={error.id} style={modalStyle.errorItem}>
                {/*<Text style={modalStyle.errorId}>ID: {error.id}</Text>*/}
                <Text style={modalStyle.errorMessage}>
                  {error.errorMessage}
                </Text>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={{ ...modalStyle.openButton, backgroundColor: "#2196F3" }}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <Text style={modalStyle.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const modalStyle = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: width * 0.8,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
  scrollView: {
    width: "100%",
    maxHeight: 200,
    marginBottom: 15,
  },
  errorItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  errorId: {
    fontSize: 16,
    fontWeight: "bold",
  },
  errorMessage: {
    fontSize: 16,
  },
  openButton: {
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 3,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});

export default ErrorModal;
