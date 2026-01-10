import { API_BASE_URL, getHeaders, apiFetch } from "./api";

export interface ContactMessageData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export async function sendContactMessage(data: ContactMessageData): Promise<boolean> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/contacts/new/`, {
            method: "POST",
            headers: getHeaders(false), // Usually public
            body: JSON.stringify(data),
        });
        return response.ok;
    } catch (error) {
        console.error("Error sending contact message:", error);
        return false;
    }
}
