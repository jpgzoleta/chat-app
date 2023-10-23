import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Dashboard({ auth }) {
    const [chatInput, setChatInput] = useState("");
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        function onConnect() {
            console.log("connected");
            setIsConnected(true);
        }

        function onDisconnect() {
            console.log("disconnected");
            setIsConnected(false);
        }

        function onChatReceive(value) {
            setChats((previous) => [...previous, value]);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("chat:receive", onChatReceive);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("chat:receive", onChatReceive);
        };
    }, []);

    function sendChat() {
        socket.emit("chat:send", { sender: auth?.user, body: chatInput });
        setChatInput("");
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-4">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            You're logged in and{" "}
                            {isConnected ? (
                                <span className="text-green-500">
                                    connected!
                                </span>
                            ) : (
                                <span className="text-red-500">
                                    not connected!
                                </span>
                            )}
                        </div>
                    </div>
                    <ul className="flex flex-col gap-2">
                        {chats.map((chat, index) => (
                            <li
                                key={index}
                                className={`flex flex-col gap-1 w-fit ${
                                    chat?.sender?.id == auth?.user?.id
                                        ? "items-end self-end"
                                        : "items-start self-start"
                                }`}
                            >
                                <p className="text-gray-500 text-xs">
                                    {chat?.sender?.name}
                                </p>
                                <div
                                    className={`px-4 py-2 rounded-md w-fit ${
                                        chat?.sender?.id == auth?.user?.id
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-700 text-white"
                                    }`}
                                >
                                    <p>{chat.body}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div
                        className="flex gap-4 items-end sticky bottom-0 py-4 dark:bg-gradient-to-t 
                    dark:from-[#111827] dark:to-transparent"
                    >
                        <TextArea
                            className="w-full resize-none"
                            placeholder="Enter message here..."
                            onChange={(e) => setChatInput(e.target.value)}
                            value={chatInput}
                            name="chatInput"
                        />
                        <PrimaryButton className="h-fit" onClick={sendChat}>
                            Send
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
