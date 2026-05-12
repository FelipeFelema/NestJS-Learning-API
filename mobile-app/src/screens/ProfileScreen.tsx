import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import { deleteUser, getMe, updateUser } from "../services/userService";
import { clearTokens } from "../storage/authStorage";
import { showAlert } from "../utils/alert";

interface ProfileScreenProps {
    onLogout: () => void;
    onGoToUsers: () => void;
}

export default function ProfileScreen({onLogout, onGoToUsers }: ProfileScreenProps) {
    const [user, setUser ] = useState<any>(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        loadUser();
    },[]);

    async function loadUser() {
        const data = await getMe();
        setUser(data);
        setName(data.name);
        setEmail(data.email);
    }

    async function handleUpdate() {
        try {
            setLoading(true);

            const dataToUpdate: any = {
                name,
                email,
            };

            if (password) {
                dataToUpdate.password = password;
            }

            const updated = await updateUser(user.id, dataToUpdate);

            setUser(updated)
            setEditing(false);
            setPassword("")

            showAlert("Success", "Profile updated successfully");

        } catch (error) {
            const err = error as any;

            console.log(err.response?.data);
            console.log(err.message)

            const message = 
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Error updating profile"

            showAlert("Error", message)

        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        showAlert(
            "Delete Account",
            "Are you sure you want to delete your account?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteUser(user.id);

                            await clearTokens();

                            showAlert("Success", "Account deleted successfully", [
                                {
                                    text: "OK",
                                    onPress: () => onLogout(),
                                },
                            ]);

                        } catch (error) {
                            const err = error as any;

                            console.log(err.response?.data);
                            console.log(err.message)

                            const message = 
                                err.response?.data?.message ||
                                err.response?.data?.error ||
                                "Error deleting account"

                            showAlert("Error", message)
                        }
                    }
                }
            ]
        )
    }

    async function handleLogout() {
        await clearTokens();
        onLogout();
    }

    if (!user) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Profile</Text>

                {editing ? (
                    <>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                            placeholder="Name"
                        />

                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            placeholder="Email"
                        />

                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                            placeholder="New Password"
                            secureTextEntry
                        />

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleUpdate}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Save</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => {
                                setEditing(false);
                                setName(user.name);
                                setEmail(user.email);
                                setPassword("");
                            }}
                        >
                            <Text style={styles.secondaryText}>Cancel</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <View style={styles.infoBox}>
                            <Text style={styles.label}>Name</Text>
                            <Text style={styles.value}>{user.name}</Text>
                        </View>

                        <View style={styles.infoBox}>
                            <Text style={styles.label}>Email</Text>
                            <Text style={styles.value}>{user.email}</Text>
                        </View>

                        <View style={styles.infoBox}>
                            <Text style={styles.label}>Role</Text>
                            <Text style={styles.value}>{user.role}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => setEditing(true)}
                        >
                            <Text style={styles.buttonText}>Edit Profile</Text>
                        </TouchableOpacity>

                        {user.role === "ADMIN" && (
                            <TouchableOpacity
                                style={styles.adminButton}
                                onPress={onGoToUsers}
                            >
                                <Text style={styles.adminText}>Manage Users</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={styles.dangerButton}
                            onPress={handleDelete}
                        >
                            <Text style={styles.buttonText}>Delete Account</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={handleLogout}
                        >
                            <Text style={styles.secondaryText}>Logout</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    elevation: 5,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  infoBox: {
    marginBottom: 15,
  },

  label: {
    fontSize: 12,
    color: "#888",
  },

  value: {
    fontSize: 16,
    fontWeight: "bold",
  },

  input: {
    backgroundColor: "#f1f3f5",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#4f46e5",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  dangerButton: {
    backgroundColor: "#dc2626",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  secondaryButton: {
    marginTop: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  adminButton: {
    backgroundColor: "#0ea5e9",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  adminText: {
    color: "#fff",
    fontWeight: "bold",
  },

  secondaryText: {
    color: "#4f46e5",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
